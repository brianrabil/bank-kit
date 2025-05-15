#!/usr/bin/env bun
/**
 * ---------------------------------------------------------------------------
 * turbo-sdk.ts
 * Typed helper utilities for working with Turborepo inside a Bun workspace.
 *
 * @packageDocumentation
 * ---------------------------------------------------------------------------
 */

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { $ } from "bun"; // bun's subprocess sugar
import type { SpawnOptions } from "bun";

////////////////////////////////////////////////////////////////////////////////
// 🔑 Types
////////////////////////////////////////////////////////////////////////////////

export interface RunOptions {
	/** Glob-compatible package filter (e.g. "docs", "web-*") */
	filter?: string;
	timeoutMs?: number;
	ipc?: boolean; // forward IPC messages (Bun ↔ Bun) to stdout
}

export interface RunResult {
	success: boolean;
	tasks: unknown[]; // ↯ shape depends on --output-logs=json from Turborepo
}

////////////////////////////////////////////////////////////////////////////////
// 🏭 Helpers
////////////////////////////////////////////////////////////////////////////////

/** Ascend directories until turbo.json *or* package.json with "workspaces" is found. */
export async function findMonorepoRoot(
	startDir = process.cwd(),
): Promise<string> {
	let dir = path.resolve(startDir); // absolute
	while (true) {
		const turboJson = path.join(dir, "turbo.json");
		if (existsSync(turboJson)) return dir;

		const pkgJsonPath = path.join(dir, "package.json");
		if (existsSync(pkgJsonPath)) {
			const { workspaces } = await Bun.file(pkgJsonPath).json();
			if (workspaces) return dir;
		}

		const parent = dir.split(path.sep).slice(0, -1).join(path.sep) || path.sep;
		if (parent === dir) throw new Error("❌ Not inside a Turborepo monorepo.");
		dir = parent;
	}
}

/** Returns workspace directories expanded from package.json workspaces globs. */
export async function getWorkspaces(root: string): Promise<string[]> {
	const { workspaces = [] } = await Bun.file(
		path.join(root, "package.json"),
	).json();
	const dirs: string[] = [];

	for (const glob of workspaces) {
		// Very small glob implementation: "<dir>/*"
		const base = glob.replace("/*", "");
		const abs = path.join(root, base);
		if (!existsSync(abs)) continue;

		for (const entry of readdirSync(abs, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const candidate = path.join(base, entry.name);
			if (existsSync(path.join(root, candidate, "package.json")))
				dirs.push(candidate);
		}
	}

	return dirs.sort();
}

/** Pretty print tasks defined across all packages. */
export async function listTasks(
	root: string,
	workspaces: string[],
): Promise<void> {
	const tasks = new Map<string, string[]>();

	for (const ws of workspaces) {
		const pkg = await Bun.file(path.join(root, ws, "package.json")).json();
		for (const name of Object.keys(pkg.scripts ?? {})) {
			(tasks.get(name) ?? tasks.set(name, []).get(name))?.push(ws);
		}
	}

	console.info("📜 Available tasks:");
	for (const [name, pkgs] of tasks) {
		console.info(`  • ${name.padEnd(16)} → ${pkgs.join(", ")}`);
	}
}

////////////////////////////////////////////////////////////////////////////////
// 🚀 TurboSDK
////////////////////////////////////////////////////////////////////////////////

export class TurboSDK {
	constructor(readonly root: string) {
		if (!existsSync(path.join(this.root, "node_modules", ".bin", "turbo"))) {
			throw new Error(
				"Missing Turborepo. Run: bun add -D turbo && bun turbo --version",
			);
		}
	}

	static async create(root?: string): Promise<TurboSDK> {
		const resolvedRoot = root ?? (await findMonorepoRoot());
		return new TurboSDK(resolvedRoot);
	}

	/**
	 * Run a Turborepo task and return structured JSON output.
	 *
	 * Internally we call `bunx turbo run <task> --output-logs=json`
	 * so results are machine-parsable.
	 */
	async runTask(task: string, opts: RunOptions = {}): Promise<RunResult> {
		// build argument vector
		const argv = [
			"bunx",
			"turbo",
			"run",
			task,
			"--output-logs=json",
			"--color=always",
		];
		if (opts.filter) argv.push("--filter", opts.filter);

		// IPC channel between parent and child (optional); useful for debug
		let ipcHandler: ((msg: unknown) => void) | undefined;
		if (opts.ipc) {
			ipcHandler = (m) => console.debug("🔄 IPC:", m);
		}

		const proc = Bun.spawn(argv, {
			cwd: this.root,
			stdio: ["inherit", "pipe", "inherit"],
			ipc: ipcHandler,
			timeout: opts.timeoutMs,
			onExit(
				_process: unknown,
				code: number | null,
				signal: number | null,
				_error?: Error,
			) {
				if (signal !== null) console.warn(`⚠️  Exited via signal ${signal}`);
				if (code !== 0 && code !== null)
					console.error(`❌ Turbo finished with code ${code}`);
			},
		});

		const outText = await new Response(proc.stdout).text();
		await proc.exited; // ensure exit handler fired

		// parse structured logs
		try {
			const { success, tasks } = JSON.parse(outText);
			return { success, tasks };
		} catch {
			return { success: false, tasks: [] };
		}
	}

	/** Quick synchronous wrapper – handy for small CLI utilities. */
	runTaskSync(task: string, opts: RunOptions = {}): RunResult {
		const argv = [
			"turbo",
			"run",
			task,
			"--output-logs=json",
			...(opts.filter ? ["--filter", opts.filter] : []),
		];

		const { stdout, success } = Bun.spawnSync(argv, {
			cwd: this.root,
			stdio: ["ignore", "pipe", "ignore"],
			timeout: opts.timeoutMs,
		});

		try {
			const outStr =
				typeof stdout === "string"
					? stdout
					: Buffer.isBuffer(stdout)
						? stdout.toString()
						: "";
			const { tasks } = JSON.parse(outStr);
			return { success, tasks };
		} catch {
			return { success: false, tasks: [] };
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
// 🛠️ CLI driver (bun run turbo-sdk <cmd>)
////////////////////////////////////////////////////////////////////////////////

if (import.meta.main) {
	const [cmd = "help", ...rest] = Bun.argv.slice(2);
	const sdk = new TurboSDK(process.cwd());

	switch (cmd) {
		case "root": {
			console.log(sdk.root);
			break;
		}
		case "workspaces": {
			console.log((await getWorkspaces(sdk.root)).join("\n"));
			break;
		}
		case "tasks": {
			listTasks(sdk.root, await getWorkspaces(sdk.root));
			break;
		}
		case "run": {
			const [task, ...flags] = rest;
			if (!task) {
				console.error("❌ turbo-sdk run <task> [--filter <pkg>]");
				process.exit(1);
			}
			const filter =
				flags[0] === "--filter" || flags[0] === "-f" ? flags[1] : undefined;
			const { success } = await sdk.runTask(task, { filter });
			process.exit(success ? 0 : 1);
			break;
		}
		default:
			console.log(
				[
					"turbo-sdk commands:",
					"  root                → print monorepo root",
					"  workspaces          → list workspaces",
					"  tasks               → show script matrix",
					"  run <task> [-f pkg] → run task via turborepo",
				].join("\n"),
			);
	}
}
