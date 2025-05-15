// import type { BaseColor } from "@/registry/registry-base-colors";
// import type { Style } from "@/registry/registry-styles";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TODO_TYPEME = any;

type Config = {
	// style: Style["name"];
	// theme: BaseColor["name"];
	style: TODO_TYPEME;
	theme: TODO_TYPEME;
	radius: number;
	packageManager: "npm" | "yarn" | "pnpm" | "bun";
	installationType: "cli" | "manual";
};

const configAtom = atomWithStorage<Config>("config", {
	style: "new-york",
	theme: "zinc",
	radius: 0.5,
	packageManager: "pnpm",
	installationType: "cli",
});

export function useConfig() {
	return useAtom(configAtom);
}
