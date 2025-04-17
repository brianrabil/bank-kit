"use client";

import { Button } from "@bank-kit/ui/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
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
			<MoonIcon className="dark:hidden" />
			<SunIcon className="hidden dark:block" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
