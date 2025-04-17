"use client";

import { cn } from "@bank-kit/ui/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

/**
 * @module BankKit/Typography
 * @description
 * Fully‑typed typography primitives for **Bank‑Kit**.
 * Optimized for **React 19** (no ref‑forwarding boilerplate) and powered by
 * [class‑variance‑authority](https://github.com/joe-bell/cva) for ergonomic
 * variant management.
 *
 * ### Highlights
 * 1. **Single source** of truth: the polymorphic {@link Text} component.
 * 2. **Variants** (`display` | `body`) & **sizes** (2xl → xs) map directly to
 *    your design‑token typography scale. citeturn0file0
 * 3. **Convenience wrappers** (`Display2XL`, `Muted`, etc.) for friction‑free DX.
 * 4. Rich **TSDoc** comments for IntelliSense autocompletion in VS Code / WebStorm.
 *
 * @packageDocumentation
 */

/* -------------------------------------------------------------------------- */
/* 1️⃣  Size maps                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Tailwind utility strings for each display size token.
 * Font sizes & line heights originate from the design spec PDF. citeturn0file0
 */
const DISPLAY_SIZES = {
	"2xl": "text-[72px] leading-[90px] tracking-[-0.02em]",
	xl: "text-[60px] leading-[72px] tracking-[-0.02em]",
	lg: "text-[48px] leading-[60px] tracking-[-0.02em]",
	md: "text-[36px] leading-[44px] tracking-[-0.02em]",
	sm: "text-[30px] leading-[38px]",
	xs: "text-[24px] leading-[32px]",
} as const;

/** Allowed value set for {@link TextProps.size} when `variant` is `display`. */
type DisplaySize = keyof typeof DISPLAY_SIZES;

/**
 * Tailwind utility strings for body‑copy size tokens.
 */
const BODY_SIZES = {
	xl: "text-[20px] leading-[30px]",
	lg: "text-[18px] leading-[28px]",
	md: "text-base leading-6",
	sm: "text-sm leading-5",
	xs: "text-xs leading-[18px]",
} as const;

/** Allowed value set for {@link TextProps.size} when `variant` is `body`. */
type BodySize = keyof typeof BODY_SIZES;

/* -------------------------------------------------------------------------- */
/* 2️⃣  Base style variants (weight & color)                                   */
/* -------------------------------------------------------------------------- */

/**
 * Base style generator for weight & color variants using **cva**.
 */
export const textVariants = cva("", {
	variants: {
		/** Font weight options */
		weight: {
			regular: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
		/** Color options tied to Tailwind design tokens */
		color: {
			foreground: "text-foreground",
			muted: "text-muted-foreground",
			primary: "text-primary",
			success: "text-success",
			danger: "text-danger",
		},
	},
	defaultVariants: {
		weight: "regular",
		color: "foreground",
	},
});

/** Extracted variant prop types for {@link TextProps}. */
type BaseVariants = VariantProps<typeof textVariants>;

/* -------------------------------------------------------------------------- */
/* 3️⃣  Text component                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Polymorphic props for {@link Text}.
 *
 * @typeParam E - Intrinsic or custom React element type to render.
 */
export type TextProps<E extends React.ElementType = "p"> =
	React.ComponentPropsWithoutRef<E> &
		BaseVariants & {
			/** Visual style bucket. `display` → large headings, `body` → paragraph text. */
			variant?: "display" | "body";
			/** Size token within the chosen {@link TextProps.variant}. */
			size?: DisplaySize | BodySize;
			/** Render as a different intrinsic or custom component. */
			as?: E;
		};

/**
 * ### Text
 * The **one** typography primitive you need. Combines size, weight & color
 * variants with polymorphic rendering.
 *
 * @example Basic usage
 * ```tsx
 * <Text size="lg">Account Balance</Text>
 * ```
 *
 * @example Display headline
 * ```tsx
 * <Text variant="display" size="xl" weight="bold" as="h1">
 *   Your Money, Re‑imagined
 * </Text>
 * ```
 *
 * @typeParam E - Element type to render (defaults to `p`).
 * @param props - {@link TextProps}
 * @returns React element with computed className.
 */
export function Text<E extends React.ElementType = "p">({
	as,
	variant = "body",
	size = "md",
	weight,
	color,
	className,
	...props
}: TextProps<E>) {
	const Component = (as ||
		(variant === "display" ? "h2" : "p")) as React.ElementType;

	// Map size token → Tailwind class string
	const sizeClasses =
		variant === "display"
			? DISPLAY_SIZES[size as DisplaySize]
			: BODY_SIZES[size as BodySize];

	return (
		<Component
			className={cn(textVariants({ weight, color }), sizeClasses, className)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* 4️⃣  Convenience helpers                                                    */
/* -------------------------------------------------------------------------- */

/**
 * 2XL Display Heading wrapper around {@link Text}.
 */
export const Display2XL = (
	props: Omit<TextProps<"h1">, "variant" | "size">,
) => <Text as="h1" variant="display" size="2xl" weight="bold" {...props} />;

/** XL Display Heading wrapper around {@link Text}. */
export const DisplayXL = (props: Omit<TextProps<"h1">, "variant" | "size">) => (
	<Text as="h1" variant="display" size="xl" weight="bold" {...props} />
);

/** LG Display Heading wrapper around {@link Text}. */
export const DisplayLG = (props: Omit<TextProps<"h2">, "variant" | "size">) => (
	<Text as="h2" variant="display" size="lg" weight="semibold" {...props} />
);

/** Small body‑copy wrapper (`text-sm`). */
export const TextSM = (props: Omit<TextProps<"p">, "variant" | "size">) => (
	<Text variant="body" size="sm" {...props} />
);

/** Convenience muted paragraph wrapper. */
export const Muted = (props: Omit<TextProps<"p">, "color">) => (
	<Text color="muted" {...props} />
);

/* -------------------------------------------------------------------------- */
/* 5️⃣  Provider                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Optional wrapper to set baseline typographic styles—e.g. font‑family &
 * antialiasing—at the root of your application.
 */
export const TypographyProvider = ({
	children,
	className = "antialiased text-foreground",
}: React.PropsWithChildren<{ className?: string }>) => (
	<div className={className}>{children}</div>
);
