"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@bank-kit/ui/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
	const { setTheme, resolvedTheme } = useTheme();
	const [, startTransition] = React.useTransition();

	return (
		<Button
			className="h-7 w-7"
			onClick={() => {
				startTransition(() => {
					setTheme(resolvedTheme === "dark" ? "light" : "dark");
				});
			}}
			size="icon"
			variant="ghost"
		>
			<Moon className="dark:hidden" />
			<Sun className="hidden dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
