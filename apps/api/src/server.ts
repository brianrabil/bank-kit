import path from "node:path";
import registry from "@bank-kit/registry/registry.json";
import { workspace } from "@bank-kit/utils/generated/workspace";

// Locate the workspace for the registry
const registryWorkspace = workspace.get("@bank-kit/registry");
if (!registryWorkspace) throw new Error("Registry workspace not found");
const registryPublicDir = path.resolve(registryWorkspace.path, "public/r");

const server = Bun.serve({
	static: {},
	routes: {
		"/api/registry/:name": async (req) => {
			const { name } = req.params;
			const itemPath = path.resolve(registryPublicDir, `${name}.json`);
			const file = Bun.file(itemPath);
			const item = await file.json();
			if (await file.exists()) return Response.json(item);
			return Response.json({ message: "Item not found" }, { status: 404 });
		},
		"/api/registry.json": async () => {
			return Response.json(registry);
		},
		"/api/status": new Response("OK"),
		"/api/version": () => Response.json({ version: "1.0.0" }),
		"/api/*": Response.json({ message: "Not found" }, { status: 404 }),
	},
	fetch(req) {
		return new Response("Not Found", { status: 404 });
	},
	error(error) {
		console.error(error);
		return new Response(`Internal Error: ${error.message}`, {
			status: 500,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	},
	port: Bun.env.PORT || 8080,
	development: {
		hmr: true,
		console: true,
	},
});

console.log(`Listening on ${server.url}`);
