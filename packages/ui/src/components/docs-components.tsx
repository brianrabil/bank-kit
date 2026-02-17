/* -------------------------------------------------------------------------------------------------
 * docs-components.tsx
 * Re‑usable documentation helpers for the bank‑kit UI library.
 * ------------------------------------------------------------------------------------------------ */

import type * as React from "react";
import { cn } from "@bank-kit/ui/lib/utils";

/* ─────────────────────────── UI primitives you already ship ────────────────────────── */
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
} from "@bank-kit/ui/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bank-kit/ui/components/ui/table";
import { Badge } from "@bank-kit/ui/components/ui/badge";

/* -------------------------------------------------------------------------------------------------
 * ComponentPreview
 * ------------------------------------------------------------------------------------------------ */

/**
 * Props for {@link ComponentPreview}.
 */
export interface ComponentPreviewProps {
	/** Section header – keep it short. */
	title: string;
	/** Optional helper copy shown under the title. */
	description?: string;
	/** The live component(s) to render inside the demo frame. */
	children: React.ReactNode;
	/** The exact source snippet to show under the demo. */
	code: string;
	/** Extra classes for the outer `<Card>` – useful for grid layouts. */
	className?: string;
}

/**
 * Visually groups a live demo, its source code, and an optional description
 * in a single card. Designed for MDX documentation pages.
 *
 * @remarks
 * - **Layout:** title + description (header) → demo (bordered flex box) → code block.
 * - **Code block styling:** relies on the `.bg-muted` and scrollbar‑safe classes
 *   shipped with bank‑kit’s Tailwind setup.
 *
 * @example
 * ```tsx
 * <ComponentPreview
 *   title="Primary button"
 *   code={`<Button variant="primary">Pay now</Button>`}
 * >
 *   <Button variant="primary">Pay now</Button>
 * </ComponentPreview>
 * ```
 *
 * @component
 */
export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
	title,
	description,
	children,
	code,
	className,
}) => (
	<Card className={cn(className)}>
		<CardHeader>
			<CardTitle>{title}</CardTitle>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
		</CardHeader>

		<CardContent className="pt-0">
			{/* live demo */}
			<div className="mb-4 flex items-center justify-center rounded-md border p-8">
				{children}
			</div>

			{/* source code */}
			<div className="relative">
				<pre className="p-4 rounded-lg bg-muted overflow-x-auto">
					<code>{code}</code>
				</pre>
				{/* copy button hook left for future Prism / copy‑to‑clipboard integration */}
			</div>
		</CardContent>
	</Card>
);

/* -------------------------------------------------------------------------------------------------
 * PropsTable
 * ------------------------------------------------------------------------------------------------ */

/**
 * Single‑row descriptor used by {@link PropsTable}.
 */
export interface PropDescriptor {
	/** Prop name as it appears in the component’s API. */
	name: string;
	/** Type signature shown as monospace text. */
	type: string;
	/** Human‑readable explanation. */
	description: string;
	/** Default value (if any). */
	defaultValue?: string;
	/** Whether the prop must be provided. */
	required?: boolean;
}

/**
 * Props for {@link PropsTable}.
 */
export interface PropsTableProps {
	/** Array of props to list. */
	props: PropDescriptor[];
	/** Extra Tailwind classes for the wrapper. */
	className?: string;
}

/**
 * Renders a props reference table for a component.
 *
 * @example
 * ```tsx
 * <PropsTable
 *   props={[
 *     { name: 'variant', type: '"primary" | "secondary"', description: 'Visual theme' },
 *     { name: 'disabled', type: 'boolean', defaultValue: 'false' },
 *   ]}
 * />
 * ```
 *
 * @remarks
 * - Highlights **required** props with an outlined `<Badge>`.
 * - Uses the same typography as shadcn‑styled `Table` primitives.
 *
 * @component
 */
export const PropsTable: React.FC<PropsTableProps> = ({ props, className }) => (
	<div className={cn(className)}>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[180px]">Name</TableHead>
					<TableHead className="w-[200px]">Type</TableHead>
					<TableHead>Description</TableHead>
					<TableHead className="w-[150px]">Default</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{props.map((prop) => (
					<TableRow key={prop.name}>
						<TableCell className="font-mono text-sm">
							{prop.name}
							{prop.required && (
								<Badge variant="outline" className="ml-2 text-xs">
									Required
								</Badge>
							)}
						</TableCell>

						<TableCell className="font-mono text-xs">{prop.type}</TableCell>
						<TableCell>{prop.description}</TableCell>
						<TableCell className="font-mono text-xs">
							{prop.defaultValue ?? "—"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);
