#!/usr/bin/env bun

import { TurboSDK, findMonorepoRoot, getWorkspaces, listTasks } from "./lib";

/**
 * Main CLI entry point to handle user commands.
 */
async function main() {
	try {
		const turbo = new TurboSDK(process.cwd());
		const root = await findMonorepoRoot();
		const workspaces = await getWorkspaces(root);

		const command = process.argv[2];
		if (command === "view") {
			await listTasks(root, workspaces);
		} else if (command === "run") {
			const task = process.argv[3];
			if (!task) {
				console.error("Task name is required");
				process.exit(1);
			}
			const filter = process.argv[4]
				? process.argv[4].replace("--filter=", "")
				: undefined;
			await turbo.runTask(task, { filter });
		} else {
			console.log("Usage: turbo-util <command>");
			console.log("Commands:");
			console.log("  view                    List all tasks");
			console.log("  run <task> [--filter=<package>]  Run a task");
			console.log("  edit config             Edit turbo.json");
			console.log("  edit <task> <package>   Edit package.json for the task");
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(String(error));
		}
		process.exit(1);
	}
}

main();
