/**
 * ---------------------------------------------------------------------------
 * workspace-types.ts
 * Auto-generated – describes every workspace in the monorepo.
 *
 * @packageDocumentation
 * © 2025 Bank Kit – MIT License
 * ---------------------------------------------------------------------------
 */

export enum WorkspaceType {
	ROOT = "root",
	APP = "app",
	PACKAGE = "package",
	UNKNOWN = "unknown",
}

export const bank_kit_root = {
	name: "@bank-kit/root",
	path: "",
	type: WorkspaceType.ROOT,
} as const;

export const bank_kit_api = {
	name: "@bank-kit/api",
	path: "apps/api",
	type: WorkspaceType.APP,
} as const;

export const bank_kit_cli = {
	name: "@bank-kit/cli",
	path: "apps/cli",
	type: WorkspaceType.APP,
} as const;

export const bank_kit_docs = {
	name: "@bank-kit/docs",
	path: "apps/docs",
	type: WorkspaceType.APP,
} as const;

export const bank_kit_typescript_config = {
	name: "@bank-kit/typescript-config",
	path: "packages/typescript-config",
	type: WorkspaceType.PACKAGE,
} as const;

export const bank_kit_registry = {
	name: "@bank-kit/registry",
	path: "packages/registry",
	type: WorkspaceType.PACKAGE,
} as const;

export const bank_kit_utils = {
	name: "@bank-kit/utils",
	path: "packages/utils",
	type: WorkspaceType.PACKAGE,
} as const;

export const bank_kit_ui = {
	name: "@bank-kit/ui",
	path: "packages/ui",
	type: WorkspaceType.PACKAGE,
} as const;

export const WORKSPACES = {
	bank_kit_root,
	bank_kit_api,
	bank_kit_cli,
	bank_kit_docs,
	bank_kit_typescript_config,
	bank_kit_registry,
	bank_kit_utils,
	bank_kit_ui,
} as const;

export type WorkspaceConst = keyof typeof WORKSPACES;
/* ------------------------------------------------------------------------ */
