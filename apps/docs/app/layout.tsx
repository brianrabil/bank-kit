import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "@bank-kit/ui/globals.css";

export const metadata = {
	// Define your metadata here
	// For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
	title: "Bank Kit UI",
	description: "Documentation for Nextra",
};

const banner = (
	<Banner storageKey="some-key">Bank Kit 4.0 is released 🎉</Banner>
);

const navbar = <Navbar logo={<b>Bank Kit</b>} />;

const footer = <Footer>MIT {new Date().getFullYear()} © Bank Kit UI.</Footer>;

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html
			// Not required, but good for SEO
			lang="en"
			// Required to be set
			dir="ltr"
			// Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
			suppressHydrationWarning
		>
			<Head
			// ... Your additional head options
			>
				{/* Your additional tags should be passed as `children` of `<Head>` element */}
			</Head>
			<body>
				<Layout
					// banner={banner}
					navbar={navbar}
					pageMap={await getPageMap()}
					docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
					footer={footer}
				>
					{children}
				</Layout>
			</body>
		</html>
	);
}
