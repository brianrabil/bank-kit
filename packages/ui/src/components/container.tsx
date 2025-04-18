import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@bank-kit/ui/lib/utils";

/**
 * Defines the Tailwind utility classes for the Container component.
 *
 * - `width` controls the maximum horizontal width:
 *   - `full` — spans 100% of the viewport
 *   - `container` — uses Tailwind’s built-in container sizing
 *   - `xs` … `7xl` — applies `max-w-{size}` at centered auto margins
 * - `gutter` controls horizontal padding:
 *   - `none` — no padding
 *   - `responsive` — padding on `sm` and `lg` breakpoints
 *   - `always` — padding applied at all breakpoints
 */
const containerVariants = cva("", {
	variants: {
		width: {
			full: "w-full",
			container: "container mx-auto",
			xs: "mx-auto max-w-xs",
			sm: "mx-auto max-w-sm",
			md: "mx-auto max-w-md",
			lg: "mx-auto max-w-lg",
			xl: "mx-auto max-w-xl",
			"2xl": "mx-auto max-w-2xl",
			"3xl": "mx-auto max-w-3xl",
			"4xl": "mx-auto max-w-4xl",
			"5xl": "mx-auto max-w-5xl",
			"6xl": "mx-auto max-w-6xl",
			"7xl": "mx-auto max-w-7xl",
		},
		gutter: {
			none: "",
			responsive: "sm:px-6 lg:px-8",
			always: "px-4 sm:px-6 lg:px-8",
		},
	},
	defaultVariants: {
		width: "7xl",
		gutter: "responsive",
	},
});

/**
 * Props for the Container component.
 */
export interface ContainerProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof containerVariants> {
	/**
	 * Render the component as a Radix Slot, merging props with the child element
	 * and avoiding extra wrapper nodes.
	 *
	 * @defaultValue `false`
	 */
	asChild?: boolean;

	/**
	 * Additional Tailwind CSS classes to apply on the container.
	 */
	className?: string;

	/**
	 * Content to be wrapped inside the container.
	 */
	children: React.ReactNode;
}

/**
 * **Container**
 *
 * A versatile layout wrapper for financial and banking UIs.
 * Centers its content, enforces a configurable maximum width, and applies
 * horizontal padding (gutter) based on your design requirements.
 *
 * @example
 * ```tsx
 * // Default: centered at 7xl width with responsive gutter
 * <Container>
 *   <div>Page content</div>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * // Full-width with always-on padding
 * <Container width="full" gutter="always">
 *   <div>Full bleed section</div>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * // Using asChild to avoid extra wrapper DOM
 * <Container asChild width="container" gutter="always">
 *   <section>
 *     <div>Nested section without extra div</div>
 *   </section>
 * </Container>
 * ```
 */
export function Container({
	width,
	gutter,
	asChild = false,
	className,
	children,
	...props
}: ContainerProps) {
	const Component = asChild ? Slot : "div";
	const classes = cn(containerVariants({ width, gutter }), className);

	return (
		<Component className={classes} {...props}>
			{children}
		</Component>
	);
}
