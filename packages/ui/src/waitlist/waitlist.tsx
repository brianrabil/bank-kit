"use server";

import { redis } from "@bank-kit/ui/lib/redis";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Invalid email address"),
});
interface EmailTemplateProps {
	email: string;
}

export function EmailTemplate({ email }: EmailTemplateProps) {
	return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to Our Waitlist</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome to Our Waitlist!</h1>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            Thank you for joining our waitlist. We've received your email address (${email}) and will keep you updated on our progress.
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            We're working hard to create something amazing and can't wait to share it with you!
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500;">The Team</p>
        </div>
      </body>
    </html>
  `;
}

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
