import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
	// ... Other Nextra config options
	// contentDirBasePath: '/docs'
	contentDirBasePath: "/app/docs",
});

export default withNextra({
	transpilePackages: ["@bank-kit/ui", "@bank-kit/registry"],
});
