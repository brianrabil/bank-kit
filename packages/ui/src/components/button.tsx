import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@bank-kit/ui/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Button – styling variants
 * ------------------------------------------------------------------------------------------------ */

/**
 * Tailwind utility generator for the {@link Button} component.
 *
 * @remarks
 * Uses **class‑variance‑authority** to expose `variant` & `size` props while ensuring
 * a single source of truth for Tailwind classes.
 * Consumers rarely import this directly – it exists so you can create themed
 * derivatives via:
 *
 * ```ts
 * import { buttonVariants } from '@bank-kit/ui';
 *
 * const MyButton = forwardRef<HTMLButtonElement, VariantProps<typeof buttonVariants>>(
 *   (props, ref) => <button ref={ref} className={cn(buttonVariants(props), 'my-extra')} />
 * );
 * ```
 */
export const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 " +
		"disabled:pointer-events-none ring-offset-background",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				outline:
					"border border-input hover:bg-accent hover:text-accent-foreground",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 px-3 rounded-md",
				lg: "h-11 px-8 rounded-md",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

/* -------------------------------------------------------------------------------------------------
 * Button – component
 * ------------------------------------------------------------------------------------------------ */

/**
 * Props for {@link Button}.
 */
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	/**
	 * When `true`, shows a spinner and disables the button to prevent
	 * accidental double‑clicks.
	 */
	isLoading?: boolean;

	/** Custom label displayed while loading (defaults to `Please wait`). */
	loadingText?: string;

	/** Icon shown before the children. */
	leftIcon?: React.ReactNode;

	/** Icon shown after the children. */
	rightIcon?: React.ReactNode;

	/**
	 * Render as a Radix `Slot` instead of a native `<button>`.
	 * Handy when you need a link or another component to adopt button visuals.
	 */
	asChild?: boolean;
}

/**
 * **Primary action trigger** for bank‑kit UIs.
 *
 * @example
 * Basic usage
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * ```
 *
 * @example
 * Variants & icons
 * ```tsx
 * <Button variant="destructive" leftIcon={<Trash2 size={16} />}>
 *   Delete
 * </Button>
 * ```
 *
 * @example
 * Loading state
 * ```tsx
 * <Button isLoading loadingText="Transferring…">Transfer</Button>
 * ```
 *
 * @component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			isLoading = false,
			loadingText = "Please wait",
			leftIcon,
			rightIcon,
			asChild = false,
			disabled,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const content =
			isLoading && !children ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<>
					{leftIcon && (
						<span className={cn(isLoading && "opacity-0 mr-2", "mr-2")}>
							{leftIcon}
						</span>
					)}
					{isLoading ? loadingText : children}
					{rightIcon && (
						<span className={cn(isLoading && "opacity-0 ml-2", "ml-2")}>
							{rightIcon}
						</span>
					)}
				</>
			);

		return (
			<Comp
				ref={ref}
				className={cn(buttonVariants({ variant, size }), className)}
				disabled={disabled || isLoading}
				{...props}
			>
				{/* always reserve space for spinner to avoid layout shift */}
				{isLoading && (
					<Loader2 className="absolute h-4 w-4 animate-spin" aria-hidden />
				)}
				{content}
			</Comp>
		);
	},
);

Button.displayName = "Button";
