import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	outputFileTracingIncludes: {
		registry: ["./../../registry/**/*"],
	},
	transpilePackages: ["@bank-kit/ui", "@bank-kit/registry"],
};

export default nextConfig;
