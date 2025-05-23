import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { transformerTwoslash } from 'fumadocs-twoslash';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { createFileSystemTypesCache } from 'fumadocs-twoslash/cache-fs';


// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
	dir: "content/docs",
});

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			transformers: [
				...(rehypeCodeDefaultOptions.transformers ?? []),
				transformerTwoslash({
					typesCache: createFileSystemTypesCache(),
				}),
			],
			langs: ['tsx', 'ts', 'js', 'jsx', 'json', 'mdx', "bash"],
		},
	},
});
