"use client";

import { Button } from "@bank-kit/ui/registry/new-york/ui/button";
import { Input } from "@bank-kit/ui/registry/new-york/ui/input";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export interface WaitlistFormProps {
	readonly onSubmit: (email: string) => void;
}

const waitlistSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

export function WaitlistForm({ onSubmit }: WaitlistFormProps) {
	const form = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			onSubmit(value.email);
		},
		validators: {
			onSubmit: waitlistSchema,
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
			className="w-full space-y-4 mb-8"
			noValidate
		>
			<div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-primary">
				<form.Field name="email">
					{(field) => (
						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							type="email"
							placeholder="Enter your email"
							required
							onChange={(e) => field.handleChange(e.target.value)}
							aria-describedby="email-error"
							className="w-full border-0 focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
						/>
					)}
				</form.Field>
			</div>
			<form.Subscribe
				selector={(state) => [
					state.errorMap,
					state.canSubmit,
					state.isSubmitting,
				]}
			>
				{([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						disabled={!canSubmit}
						className="font-semibold px-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none w-[120px]"
					>
						{isSubmitting ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							"Get Notified"
						)}
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
