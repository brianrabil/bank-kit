"use client";

import { cn } from "@bank-kit/ui/lib/utils";
import {
	Highlight,
	type Language,
	type PrismTheme,
	themes,
} from "prism-react-renderer";
import type * as React from "react";

/** -------------------------------------------------------------------------
 * CodeBlock — bank‑kit
 * --------------------------------------------------------------------------
 * A syntax‑highlighted code block powered by **prism-react-renderer** with:
 *  • Copy‑to‑clipboard button (instant feedback ✔︎ icon)
 *  • Language / framework switcher via shadcn Tabs
 *  • Dark theme that respects parent darkMode context
 * --------------------------------------------------------------------------*/

/**
 * Props for the CodeBlock component
 * @interface CodeBlockProps
 */
export interface CodeBlockProps {
	/**
	 * The Prism language identifier for syntax highlighting
	 * @example "typescript" | "tsx" | "javascript" | "jsx"
	 */
	readonly language: Language;

	/**
	 * The code string to be displayed and highlighted
	 */
	readonly code: string;

	/**
	 * Optional additional className to be applied to the wrapper element
	 */
	readonly className?: string;

	/**
	 * Optional additional style to be applied to the wrapper element
	 */
	readonly style?: React.CSSProperties;

	/**
	 * Optional theme override for the code block styling
	 * @default themes.vsLight
	 */
	readonly theme?: PrismTheme;
}

export function CodeBlock({
	code,
	className,
	style,
	language = "tsx",
	theme = themes.vsLight,
}: CodeBlockProps) {
	return (
		<div className={cn(className)} style={style}>
			<Highlight code={code.trim()} theme={theme} language={language}>
				{({
					className: _className,
					style,
					tokens,
					getLineProps,
					getTokenProps,
				}) => (
					<pre
						className={cn("px-4 py-6 overflow-x-auto text-[13px]", _className)}
						style={style}
					>
						{tokens.map((line, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div key={i} {...getLineProps({ line, key: i })}>
								{line.map((token, key) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<span key={key} {...getTokenProps({ token, key })} />
								))}
							</div>
						))}
					</pre>
				)}
			</Highlight>
		</div>
	);
}
