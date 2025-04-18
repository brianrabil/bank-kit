import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	serverExternalPackages: ["typescript", "twoslash"],
	transpilePackages: ["@bank-kit/ui", "@bank-kit/registry"],
};

export default withMDX(config);
