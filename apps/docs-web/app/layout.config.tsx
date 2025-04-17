import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		transparentMode: "top",
		title: (
			<>
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Logo"
				>
					<title>Bank Kit</title>
					<circle cx={12} cy={12} r={12} fill="currentColor" />
				</svg>
				My App
			</>
		),
	},
	themeSwitch: {
		mode: "light-dark-system",
	},
	links: [
		{
			text: "Documentation",
			url: "/docs",
			active: "nested-url",
		},
	],
};
