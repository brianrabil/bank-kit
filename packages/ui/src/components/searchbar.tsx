"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@bank-kit/ui/lib/utils";
import { Input } from "@bank-kit/ui/registry/new-york/ui/input";
import { debounce } from "@tanstack/pacer";

/* -------------------------------------------------------------------------------------------------
 * Searchbar – component
 * ------------------------------------------------------------------------------------------------ */

/**
 * Props for {@link Searchbar}.
 */
export interface SearchbarProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	/** Optional className for styling the searchbar container */
	containerClassName?: string;
	/** Optional className for styling the search icon */
	iconClassName?: string;
	/** Callback function that is called when the search value changes */
	onChange?: (value: string) => void;
	/** Optional placeholder text */
	placeholder?: string;
	/** Optional debounce time in milliseconds */
	debounceTime?: number;
}

/**
 * **Search input** component with built‑in debouncing and icon.
 *
 * @example
 * Basic usage
 * ```tsx
 * <Searchbar onChange={(value) => console.log(value)} />
 * ```
 *
 * @example
 * Custom styling
 * ```tsx
 * <Searchbar
 *   containerClassName="w-full max-w-md"
 *   iconClassName="text-primary"
 *   className="bg-background"
 * />
 * ```
 *
 * @example
 * Custom debounce time
 * ```tsx
 * <Searchbar
 *   debounceTime={500}
 *   placeholder="Search items..."
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @component
 */
export const Searchbar = React.forwardRef<HTMLInputElement, SearchbarProps>(
	(
		{
			className,
			containerClassName,
			iconClassName,
			onChange,
			placeholder = "Search...",
			debounceTime = 300,
			...props
		},
		ref,
	) => {
		const [value, setValue] = React.useState("");

		const debouncedOnChange = React.useMemo(
			() =>
				debounce(
					(searchTerm: string) => {
						onChange?.(searchTerm);
					},
					{
						wait: debounceTime,
						trailing: true,
					},
				),
			[debounceTime, onChange],
		);

		const handleChange = React.useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const newValue = e.target.value;
				setValue(newValue);
				debouncedOnChange(newValue);
			},
			[debouncedOnChange],
		);

		return (
			<div className={cn("relative", containerClassName || "")}>
				<Search
					className={cn(
						"absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
						iconClassName || "",
					)}
				/>
				<Input
					ref={ref}
					type="search"
					placeholder={placeholder}
					className={cn("pl-9", className || "")}
					value={value}
					onChange={handleChange}
					{...props}
				/>
			</div>
		);
	},
);

Searchbar.displayName = "Searchbar";
