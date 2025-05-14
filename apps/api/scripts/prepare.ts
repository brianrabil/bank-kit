import path from "node:path";
import registry from "@bank-kit/registry/registry.json";
import { workspace } from "@bank-kit/utils/generated/workspace";

// Locate the workspace for the registry
const registryWorkspace = workspace.get("@bank-kit/registry");
if (!registryWorkspace) throw new Error("Registry workspace not found");
const registryPublicDir = path.resolve(registryWorkspace.path, "public/r");
