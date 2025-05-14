const server = Bun.serve({
	routes: {
		"/api/registry/:name": async (req) => {
			const file = await Bun.file(`public/r/${req.params.name}.json`).json();
			return Response.json(file);
		},
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
		hmr: Bun.env.NODE_ENV === "development",
	},
});

console.log(`Listening on ${server.url}`);
