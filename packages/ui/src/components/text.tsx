import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("font-sans", {
	variants: {
		variant: {
			// Display Variants (using standard sizes + specific leading/tracking)
			"display-2xl": "text-7xl leading-[90px] tracking-[-0.02em]", // 72px / 90px / -2%
			"display-xl": "text-6xl leading-[72px] tracking-[-0.02em]", // 60px / 72px / -2%
			"display-lg": "text-5xl leading-[60px] tracking-[-0.02em]", // 48px / 60px / -2%
			"display-md": "text-4xl leading-[44px] tracking-[-0.02em]", // 36px / 44px / -2%
			"display-sm": "text-3xl leading-[38px]", // 30px / 38px / normal tracking
			"display-xs": "text-2xl leading-[32px]", // 24px / 32px / normal tracking

			// Text Variants (using standard sizes + specific leading)
			"text-xl": "text-xl leading-[30px]", // 20px / 30px / normal tracking
			"text-lg": "text-lg leading-[28px]", // 18px / 28px / normal tracking
			"text-md": "text-base leading-[24px]", // 16px / 24px / normal tracking (Tailwind's text-base)
			"text-sm": "text-sm leading-[20px]", // 14px / 20px / normal tracking
			"text-xs": "text-xs leading-[18px]", // 12px / 18px / normal tracking
		},
		weight: {
			regular: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
	},
	defaultVariants: {
		variant: "text-md",
		weight: "regular",
	},
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

const variantTagMap: Record<TextVariant, React.ElementType> = {
	"display-2xl": "h1",
	"display-xl": "h1",
	"display-lg": "h1",
	"display-md": "h2",
	"display-sm": "h3",
	"display-xs": "h4",
	"text-xl": "p",
	"text-lg": "p",
	"text-md": "p",
	"text-sm": "p",
	"text-xs": "p",
};

/**
 * Props for the Text component.
 * Extends standard HTML paragraph element props and cva variant props.
 */
export interface TextProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof textVariants> {
	/**
	 * If true, the component will render its child directly, merging its own props
	 * and className with the child's. Useful for applying text styles
	 * to existing components without adding extra DOM nodes.
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * The content to be rendered inside the text component.
	 */
	children: React.ReactNode;
	/**
	 * Additional CSS classes to apply. These will be merged with variant classes.
	 */
	className?: string; // Explicitly listed for TSDoc clarity, though already in HTMLAttributes
}

/**
 * Text component for rendering text with predefined styles from the design system.
 * Uses cva (Class Variance Authority) and Tailwind CSS for handling variants.
 * Supports polymorphism via the `as` prop and composition via the `asChild` prop.
 *
 * @example
 * // Default paragraph text (text-md, regular)
 * <Text>This is body text.</Text>
 *
 * @example
 * // Large display heading, bold
 * <Text variant="display-lg" weight="bold">Large Heading</Text>
 *
 * @example
 * // Render as an h1 element with specific variant/weight
 * <Text variant="display-xl" weight="semibold">
 * Page Title
 * </Text>
 *
 * @example
 * // Apply small, medium-weight styles to a Link component
 * <Text variant="text-sm" weight="medium" asChild>
 * <a href="#">Read More</a>
 * </Text>
 *
 * @example
 * // Override text color using className
 * <Text variant="text-lg" className="text-blue-600">Special Text</Text>
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	(
		{
			className,
			variant = "text-md",
			weight,
			asChild = false,
			children,
			...props
		},
		ref,
	) => {
		// 1. Determine the required tag based *only* on the variant
		const RequiredTag = variantTagMap[variant ?? "text-md"];

		// 2. Determine the component to render:
		//    - Slot if asChild is true.
		//    - The RequiredTag based on the variant otherwise.
		const Comp = asChild ? Slot : RequiredTag;

		// 3. Generate class names using cva
		const combinedClassName = textVariants({ variant, weight, className });

		// 4. Render the component
		return (
			<Comp ref={ref} className={combinedClassName} {...props}>
				{children}
			</Comp>
		);
	},
);

Text.displayName = "Text";
