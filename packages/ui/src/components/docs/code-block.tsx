"use client";

import { Tabs } from "@/components/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/new-york/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/registry/new-york/ui/collapsible";
import { useConfig } from "@/registry/new-york/use-config";
import * as React from "react";

export function CodeTabs({ children }: React.ComponentProps<typeof Tabs>) {
	const [config, setConfig] = useConfig();

	const installationType = React.useMemo(() => {
		return config.installationType || "cli";
	}, [config]);

	return (
		<Tabs
			value={installationType}
			onValueChange={(value) =>
				setConfig({ ...config, installationType: value as "cli" | "manual" })
			}
			className="relative mt-6 w-full"
		>
			{children}
		</Tabs>
	);
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
	expandButtonTitle?: string;
}

export function CodeBlockWrapper({
	expandButtonTitle = "View Code",
	className,
	children,
	...props
}: CodeBlockProps) {
	const [isOpened, setIsOpened] = React.useState(false);

	return (
		<Collapsible open={isOpened} onOpenChange={setIsOpened}>
			<div className={cn("relative overflow-hidden", className)} {...props}>
				<CollapsibleContent
					forceMount
					className={cn("overflow-hidden", !isOpened && "max-h-32")}
				>
					<div
						className={cn(
							"[&_pre]:my-0 [&_pre]:max-h-[650px] [&_pre]:pb-[100px]",
							!isOpened ? "[&_pre]:overflow-hidden" : "[&_pre]:overflow-auto]",
						)}
					>
						{children}
					</div>
				</CollapsibleContent>
				<div
					className={cn(
						"absolute flex items-center justify-center bg-gradient-to-b from-zinc-700/30 to-zinc-950/90 p-2",
						isOpened ? "inset-x-0 bottom-0 h-12" : "inset-0",
					)}
				>
					<CollapsibleTrigger asChild>
						<Button variant="secondary" className="h-8 text-xs">
							{isOpened ? "Collapse" : expandButtonTitle}
						</Button>
					</CollapsibleTrigger>
				</div>
			</div>
		</Collapsible>
	);
}
