/**
 * ---------------------------------------------------------------------------
 * ${fileName}.ts
 * ${oneLinePurpose}
 *
 * @packageDocumentation
 *
 * @copyright  © ${year} ${org}
 * @license    MIT – see LICENSE file for details.
 * ---------------------------------------------------------------------------
 */
import path from "node:path";
import { Glob } from "bun";
import { $ } from "bun";
import { ROOT_WORKSPACE } from "../lib/constants";

interface Options {
	outDir: string;
	outFile: string;
}

const defaultOptions: Options = {
	outDir: path.resolve(import.meta.dir, "../generated"),
	outFile: "workspace.ts",
};

/* prettier console helpers ------------------------------------------------- */

const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;

function info(msg: string) {
	console.log(cyan(`[INFO] ${msg}`));
}
function success(msg: string) {
	console.log(green(`[SUCCESS] ${msg}`));
}
function warn(msg: string) {
	console.warn(yellow(`[WARN] ${msg}`));
}
function error(msg: string) {
	console.error(red(`[ERROR] ${msg}`));
}

/* ------------------------------------------------------------------------- */
export async function generateWorkspaceTypes(_opts: Partial<Options> = {}) {
	const options: Options = { ...defaultOptions, ..._opts };

	const workspaces = new Map<string, string>(); // name  -> dir

	/* ─── scan repo ───────────────────────────────────────────────────────── */
	info(`Scanning for package.json files under: ${ROOT_WORKSPACE}`);

	let skipped = 0;
	const glob = new Glob("**/package.json");

	for await (const match of glob.scan({
		cwd: ROOT_WORKSPACE,
		absolute: true,
		onlyFiles: true,
	})) {
		if (match.includes("node_modules")) {
			skipped++;
			continue;
		}

		const dirRel = path.relative(ROOT_WORKSPACE, path.dirname(match));
		const pkg = await Bun.file(match).json();
		workspaces.set(pkg.name, dirRel);
	}

	/* ─── helpers for code-gen ─────────────────────────────────────────────── */
	const toConstId = (pkgName: string) =>
		pkgName
			.replace(/^@/, "") // drop leading scope “@”
			.replace(/[\/\-]/g, "_") // “@scope/foo-bar” → “scope_foo_bar”
			.replace(/\W/g, "_");

	const constDeclarations = [...workspaces.entries()]
		.map(([name, dir]) => {
			const wsType =
				dir === ""
					? "ROOT"
					: dir.startsWith("apps/")
						? "APP"
						: dir.startsWith("packages/")
							? "PACKAGE"
							: "UNKNOWN";

			return `export const ${toConstId(name)} = {
  name: "${name}",
  path: "${dir}",
  type: WorkspaceType.${wsType},
} as const;`;
		})
		.join("\n\n");

	const aggregateKeys = [...workspaces.keys()]
		.map((n) => toConstId(n))
		.join(", ");

	/* ─── build file content ───────────────────────────────────────────────── */
	const content = /* ts */ `/**
 * ---------------------------------------------------------------------------
 * workspace-types.ts
 * Auto-generated – describes every workspace in the monorepo.
 *
 * @packageDocumentation
 * © ${new Date().getFullYear()} Bank Kit – MIT License
 * ---------------------------------------------------------------------------
 */

export enum WorkspaceType {
  ROOT = "root",
  APP = "app",
  PACKAGE = "package",
  UNKNOWN = "unknown",
}

${constDeclarations}

export const WORKSPACES = { ${aggregateKeys} } as const;

export type WorkspaceConst = keyof typeof WORKSPACES;
/* ------------------------------------------------------------------------ */
`;

	/* ─── write file & format ──────────────────────────────────────────────── */
	try {
		await Bun.write(path.join(options.outDir, options.outFile), content);
		await $`bunx biome format --write ${path.join(options.outDir, options.outFile)}`;
		success(`Generated types → ${options.outDir}/${options.outFile}`);
		return { status: "success", data: { workspaces } };
	} catch (e) {
		error(String(e));
		return {
			status: "error",
			message: e instanceof Error ? e.message : "unknown",
		};
	}
}

/* Run with:  bun run scripts/generate-workspace-types.ts ------------------- */
/* Run directly with:  bun run scripts/generate-workspace-types.ts ---------- */
if (import.meta.main) {
	await generateWorkspaceTypes();
}
