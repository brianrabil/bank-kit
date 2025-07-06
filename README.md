# Bank Kit Monorepo

Bank Kit is a collection of applications and packages for building modern banking experiences. The project uses **Bun**, **Turborepo** and **TypeScript** to manage multiple apps and shared libraries. It combines a custom UI library, a component registry, a documentation site and utilities that can be consumed across the ecosystem.

## Repository Layout

```
apps/       # runnable applications
packages/   # shared libraries and tooling
```

### Applications

- **docs/** – Next.js 15 documentation site built with Fumadocs.
- **api/** – Bun server exposing the component registry.
- **cli/** – Early WIP CLI written in TypeScript/Bun.

### Packages

- **ui/** – Enterprise‑grade component library built on Shadcn UI.
- **registry/** – Component registry definition used by the API.
- **typescript-config/** – Shared tsconfig bases.
- **utils/** – Utility scripts and configuration for docs and other packages.
- **workspace/** – Turborepo helper CLI.

## Requirements

- [Bun](https://bun.sh) 1.2+
- Node.js 20+ (for Next.js apps)

## Getting Started

Install dependencies for the entire workspace:

```bash
bun install
```

During development you will mainly use the following scripts (run from the repository root):

```bash
bun run dev       # start all dev servers via turbo
bun run build     # build all packages and apps
bun run lint      # run Biome across packages
```

Each package or app also exposes its own scripts. See the individual `README.md` files under `apps/` and `packages/` for more details.

## Project Highlights

- **Shadcn UI integration** – shared component registry and UI library.
- **TypeScript everywhere** – strict configs in `packages/typescript-config`.
- **Turborepo** – task running and caching for the monorepo.
- **Next.js 15** – modern React features with the App Router in the docs app.
- **Bun runtime** – fast scripts, CLI tools and the API server.

## License

This project is released under the [MIT License](LICENSE).
