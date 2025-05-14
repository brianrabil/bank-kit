import path from "node:path";

export const ROOT_WORKSPACE = path.resolve(import.meta.file, "../../../");
export const APPS_WORKSPACE = path.resolve(ROOT_WORKSPACE, "apps");
export const PACKAGES_WORKSPACE = path.resolve(ROOT_WORKSPACE, "packages");
