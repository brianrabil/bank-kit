import { z } from "zod";
import { processConfig } from "zodest";
import { defineCommand, defineConfig, defineOptions } from "zodest/config";

const globalOptions = defineOptions(
	z.object({
		verbose: z.boolean().default(false),
	}),
);

// const config = defineConfig({
// 	globalOptions,
// 	commands: {
// 		serve: defineCommand({
// 			description: "Start development server",
// 			options: defineOptions(
// 				z.object({
// 					port: z.coerce.number().min(1024).default(3000),
// 				}),
// 				{ p: "port" }, // aliases, type-safe with the schema
// 			),
// 			args: z.array(z.string()),
// 			action(options, args) {
// 				console.log("Server starting on port", options.port);
// 			},
// 		}),
// 	},
// });

// Process CLI arguments, returns the matching command
// const result = processConfig(config, process.argv.slice(2));

// console.log("result:", result._kind, result);
// => result._kind == 'serve', the matching command's name
// in `result` there's also `result.globalOptions`, and so on, all type-safe

// call the command
// result.command.action(result.options, result.args);
