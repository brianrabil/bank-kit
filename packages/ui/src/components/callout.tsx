import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
	Info,
	Check,
	AlertTriangle,
	AlertCircle,
	HelpCircle,
} from "lucide-react";
import { cn } from "@bank-kit/ui/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Callout – styling variants
 * ------------------------------------------------------------------------------------------------ */

/**
 * Visual variants for the {@link Callout} component.
 */
export const calloutVariants = cva(
	"relative w-full rounded-md border-l-4 p-4 flex gap-3",
	{
		variants: {
			variant: {
				default:
					"bg-muted/50 border-muted text-muted-foreground dark:bg-muted/30",
				info: "bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-100",
				success:
					"bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-100",
				warning:
					"bg-orange-500/10 border-orange-500/30 text-orange-800 dark:text-orange-100",
				destructive:
					"bg-destructive/10 border-destructive text-destructive-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/* -------------------------------------------------------------------------------------------------
 * Callout – component
 * ------------------------------------------------------------------------------------------------ */

/**
 * Props for {@link Callout}.
 */
export interface CalloutProps
	extends React.HTMLAttributes<HTMLOutputElement>,
		VariantProps<typeof calloutVariants> {
	/**
	 * Optional heading displayed in bold before the body content.
	 */
	heading?: React.ReactNode;
}

/**
 * A lightly‑styled container for highlighting information, success messages,
 * warnings, or critical errors in bank‑kit interfaces.
 *
 * @example
 * ```tsx
 * <Callout variant="warning" heading="Heads up!">
 *   This action cannot be undone.
 * </Callout>
 * ```
 *
 * @component
 */
export const Callout = React.forwardRef<HTMLOutputElement, CalloutProps>(
	({ className, variant, heading, children, ...props }, ref) => {
		/* Map variants to lucide icons */
		const Icon = React.useMemo(() => {
			switch (variant) {
				case "info":
					return Info;
				case "success":
					return Check;
				case "warning":
					return AlertTriangle;
				case "destructive":
					return AlertCircle;
				default:
					return HelpCircle;
			}
		}, [variant]);

		return (
			<output
				ref={ref}
				className={cn(calloutVariants({ variant }), className)}
				{...props}
			>
				<Icon className="h-5 w-5 flex-none mt-0.5" aria-hidden />
				<div className="space-y-1">
					{heading && <h3 className="text-sm font-medium">{heading}</h3>}
					<div className="text-sm leading-relaxed">{children}</div>
				</div>
			</output>
		);
	},
);

Callout.displayName = "Callout";
