# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bank Kit is a Turborepo monorepo for building modern banking experiences. It uses Bun as the package manager and runtime, with TypeScript throughout. The project combines a UI component library, component registry, documentation site, and CLI tools.

## Commands

### Development
- `bun install` - Install dependencies for entire workspace
- `bun run dev` - Start all dev servers via Turbo
- `bun run build` - Build all packages and apps
- `bun run lint` - Run Biome linting across packages
- `bun run lint:fix` - Run Biome with auto-fix
- `bun run biome:check` - Direct Biome check
- `bun run biome:check:write` - Direct Biome check with write

### App-specific Commands
- **docs app**: `bun run prepare` to copy registry files before building
- **api app**: `bun --watch run src/server.ts` for development
- **ui package**: `tsc --noEmit` for type checking

### Testing
- No unified test command configured - individual packages may have their own test scripts

## Architecture

### Monorepo Structure
- **apps/**: Runnable applications
  - **docs/**: Next.js 15 documentation site with Fumadocs
  - **api/**: Bun server for component registry API
  - **cli/**: TypeScript/Bun CLI tool (WIP)
- **packages/**: Shared libraries
  - **ui/**: Enterprise-grade component library built on Shadcn UI
  - **registry/**: Component registry definitions and JSON exports
  - **typescript-config/**: Shared tsconfig bases
  - **utils/**: Utility scripts and docs configuration
  - **workspace/**: Turborepo helper CLI

### Key Technologies
- **Bun**: Runtime, package manager, and build tool
- **Turborepo**: Monorepo task runner with caching
- **Next.js 15**: App Router for docs site
- **Biome**: Linting and formatting (tab indentation, double quotes)
- **TypeScript**: Strict configuration across workspace
- **Shadcn UI**: Base for component library
- **Fumadocs**: Documentation framework

### Component Registry System
The project has a sophisticated component registry:
- Components defined in `packages/registry/src/`
- JSON exports in `packages/registry/public/r/`
- API serves registry at `/r/` endpoints
- Docs site copies registry files during prepare step

### Workspace Dependencies
- UI components use workspace references (`workspace:*`)
- Registry exports JSON files for component definitions
- TypeScript configs shared across packages
- Build dependencies managed by Turbo

### Development Workflow
1. Run `bun install` for workspace setup
2. Use `bun run dev` to start all services
3. Docs app requires `prepare` script before building
4. Registry changes need API restart to reflect in endpoints
5. UI package exports styles via `./globals.css` path

## Important Notes

- Uses Bun 1.2+ and Node.js 20+ requirements
- Biome configured with tab indentation and double quotes
- No cursor rules or copilot instructions found
- Registry files are copied between packages during build
- API compiles to single binary for deployment