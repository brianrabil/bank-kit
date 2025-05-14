import path from "node:path";
import { $ } from "bun";

console.log("Starting prebuild...");

const main = path.join(import.meta.dir, "..");
const inputs = path.join(main, "../../packages/registry/public/r");
const publicDir = path.join(main, "public/r");
const distDir = path.join(main, "dist");

console.log(`Cleaning public directory: ${publicDir}`);
await $`rm -rf ${publicDir}`.cwd(main);

console.log(`Cleaning dist directory: ${distDir}`);
await $`rm -rf ${distDir}`.cwd(main);

console.log(`Creating output directory: ${publicDir}`);
await $`mkdir -p ${publicDir}`.cwd(main);

console.log(`Copying files from ${inputs} to ${publicDir}`);
await $`cp ${inputs}/* ${publicDir}`.cwd(main);

console.log("Prebuild complete.");
