"use server";

import { Resend } from "resend";
import { z } from "zod";
import { EmailTemplate } from "../components/email-template";
import { redis } from "../lib/redis";

const schema = z.object({
	email: z.string().email("Invalid email address"),
});

export async function joinWaitlist(prevState: any, formData: FormData) {
	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		const email = formData.get("email");

		if (!email) {
			return { success: false, message: "Email is required" };
		}

		const result = schema.safeParse({ email });

		if (!result.success) {
			return { success: false, message: result.error.errors[0].message };
		}

		// Store email in Upstash Redis
		await redis.sadd("waitlist_emails", email.toString());

		// Send welcome email using Resend
		const { data, error } = await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: email.toString(),
			subject: "Welcome to Our Waitlist!",
			html: EmailTemplate({ email: email.toString() }),
		});

		if (error) {
			console.error("Error sending email:", error);
			return {
				success: false,
				message: "Failed to join waitlist. Please try again.",
			};
		}

		const count = await getWaitlistCount();

		return {
			success: true,
			message:
				"You have been added to the waitlist! Check your email for confirmation.",
			count,
		};
	} catch (error) {
		console.error("Error:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		};
	}
}

export async function getWaitlistCount() {
	try {
		const count = await redis.scard("waitlist_emails");
		return count;
	} catch (error) {
		return 0;
	}
}
