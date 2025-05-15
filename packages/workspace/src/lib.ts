#!/usr/bin/env bun

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Finds the root directory of the Turborepo monorepo by locating turbo.json
 * or a package.json with a workspaces field.
 */
export async function findMonorepoRoot(): Promise<string> {
	let currentDir = process.cwd();
	while (true) {
		const turboPath = join(currentDir, "turbo.json");
		if (await Bun.file(turboPath).exists()) {
			return currentDir;
		}
		const packagePath = join(currentDir, "package.json");
		if (await Bun.file(packagePath).exists()) {
			const packageJson = JSON.parse(await Bun.file(packagePath).text());
			if (packageJson.workspaces) {
				return currentDir;
			}
		}
		const parentDir = join(currentDir, "..");
		if (parentDir === currentDir) {
			throw new Error("Not inside a Turborepo monorepo");
		}
		currentDir = parentDir;
	}
}

/**
 * Retrieves all workspace directories from the monorepo based on the
 * workspaces field in the root package.json.
 */
export async function getWorkspaces(root: string): Promise<string[]> {
	const packageJsonPath = join(root, "package.json");
	const packageJson = JSON.parse(await Bun.file(packageJsonPath).text());
	const workspaceGlobs = packageJson.workspaces || [];
	const workspaces: string[] = [];
	for (const glob of workspaceGlobs) {
		const [dir, pattern] = glob.split("/");
		if (pattern === "*") {
			const dirs = await readdir(join(root, dir), { withFileTypes: true });
			for (const subdir of dirs) {
				if (subdir.isDirectory()) {
					const packagePath = join(root, dir, subdir.name, "package.json");
					if (await Bun.file(packagePath).exists()) {
						workspaces.push(join(dir, subdir.name));
					}
				}
			}
		}
	}
	return workspaces;
}

/**
 * Lists all tasks defined in the monorepo, showing which packages define each task.
 */
export async function listTasks(root: string, workspaces: string[]) {
	const taskMap = new Map<string, string[]>();
	for (const workspace of workspaces) {
		const packagePath = join(root, workspace, "package.json");
		const packageJson = JSON.parse(await Bun.file(packagePath).text());
		const scripts = packageJson.scripts || {};
		for (const task in scripts) {
			if (!taskMap.has(task)) {
				taskMap.set(task, []);
			}
			taskMap.get(task)?.push(workspace);
		}
	}
	console.log("Available tasks:");
	for (const [task, packages] of taskMap) {
		console.log(`- ${task}: ${packages.join(", ")}`);
	}
}

/**
 * Runs a specified task using Turborepo's CLI, with an optional package filter.
 */
async function runTask(task: string, options: { filter?: string }) {
	const args = ["bunx", "turbo", "run", task];
	if (options.filter) {
		args.push("--filter", options.filter);
	}
	await Bun.spawn(args, { stdio: "inherit" });
}

/**
 * Opens the relevant configuration file in the user's default editor.
 * If a task and package are specified, opens the package's package.json;
 * otherwise, opens turbo.json.
 */
export async function editTask(task?: string, packageName?: string) {
	const root = await findMonorepoRoot();
	const editor =
		process.env.EDITOR || (process.platform === "win32" ? "notepad" : "vim");
	let fileToEdit: string;
	if (task && packageName) {
		fileToEdit = join(root, "packages", packageName, "package.json");
	} else {
		fileToEdit = join(root, "turbo.json");
	}
	await Bun.spawn([editor, fileToEdit], { stdio: "inherit" });
}

/** Options for running a task */
interface RunOptions {
	filter?: string; // Filter tasks by package name
	// Additional options can be added as needed
}

/** Result of running a task */
interface RunResult {
	success: boolean; // Indicates if the task completed successfully
	tasks: any[]; // Array of task details (structure depends on Turborepo's JSON output)
}

/** Main class for interacting with Turborepo */
class TurboSDK {
	private rootPath: string;

	/**
	 * Initializes the SDK with the monorepo root path
	 * @param rootPath Path to the monorepo root directory
	 */
	constructor(rootPath: string) {
		this.rootPath = rootPath;
		if (!this.isTurboInstalled()) {
			throw new Error(
				'Turborepo is not installed. Please run "npm install turbo" in your monorepo root.',
			);
		}
	}

	/** Checks if Turborepo is installed locally in the monorepo */
	private isTurboInstalled(): boolean {
		const turboPath = join(this.rootPath, "node_modules", ".bin", "turbo");
		return existsSync(turboPath);
	}

	/**
	 * Runs a specified task using Turborepo
	 * @param taskName Name of the task to run (e.g., 'build', 'test')
	 * @param options Options to customize the task execution
	 * @returns Promise resolving to the task execution result
	 */
	async runTask(
		taskName: string,
		options: RunOptions = {},
	): Promise<RunResult> {
		const args = ["run", taskName, "--output-logs=json"];
		if (options.filter) {
			args.push("--filter", options.filter);
		}
		// Additional options can be appended here (e.g., --parallel, --scope)

		const turboProcess = spawn("turbo", args, { cwd: this.rootPath });

		let output = "";
		turboProcess.stdout.on("data", (data) => {
			output += data.toString();
		});

		turboProcess.stderr.on("data", (data) => {
			console.error("Turborepo Error:", data.toString());
		});

		await new Promise((resolve) => turboProcess.on("close", resolve));

		try {
			const jsonOutput = JSON.parse(output);
			// Assuming jsonOutput has 'success' and 'tasks' properties based on Turborepo's JSON format
			return {
				success: jsonOutput.success || turboProcess.exitCode === 0,
				tasks: jsonOutput.tasks || [],
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to parse Turborepo output: ${error.message}`);
			}
			throw new Error(`Failed to parse Turborepo output: ${String(error)}`);
		}
	}

	// Future methods to add:
	// async getConfig(): Promise<TurboConfig> { ... }
	// async setConfig(config: TurboConfig): Promise<void> { ... }
	// async getCacheStatus(taskName: string): Promise<CacheStatus> { ... }
}

export { TurboSDK, type RunOptions, type RunResult };
