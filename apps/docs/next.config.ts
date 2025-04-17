import nextra from "nextra";

const withNextra = nextra({
	contentDirBasePath: "/app/docs",
	defaultShowCopyCode: true,
});

export default withNextra({
	transpilePackages: ["@bank-kit/ui", "@bank-kit/registry"],
});
