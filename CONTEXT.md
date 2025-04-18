# Bank Kit - Project Context

## Project Overview
Bank Kit is a monorepo project that appears to be a banking-related toolkit with multiple applications and shared packages. The project uses modern development practices and tools.

## Repository Structure

### Root Level
- Uses Turborepo for monorepo management
- Bun as the package manager (v1.2.5)
- TypeScript for type safety
- Biome for linting and formatting
- Shadcn UI components integration

### Apps
1. **docs/** - Documentation application
   - Built with Next.js
   - Uses MDX for content
   - Includes Docker support
   - Follows modern Next.js 15+ practices with App Router

2. **cli/** - Command Line Interface
   - TypeScript-based CLI tool
   - Appears to be in early development stage

### Packages
1. **ui/** - Shared UI components
2. **registry/** - Component registry (likely for Shadcn)
3. **typescript-config/** - Shared TypeScript configuration

## Technical Stack
- **Frontend Framework**: Next.js 15+
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Package Manager**: Bun
- **Build Tool**: Turborepo
- **Language**: TypeScript
- **Linting/Formatting**: Biome
- **Documentation**: MDX

## Development Practices
- Mobile-first responsive design
- React Server Components (RSC) preferred
- TypeScript for type safety
- Shadcn UI components for consistent design
- Proper error boundaries and metadata implementation
- URL state management with nuqs
- Performance optimization focus (Web Vitals)

## Project Conventions
1. **TypeScript Rules**
   - Descriptive variable names with auxiliary verbs
   - Function keyword for pure functions
   - TSDoc comments for documentation
   - RORO pattern for function parameters/returns

2. **Next.js Rules**
   - App Router architecture
   - Server Components by default
   - Proper error boundaries
   - SEO metadata implementation
   - Image optimization with Next.js Image component

3. **React Rules**
   - Shadcn components preferred
   - Named exports for components
   - Mobile-first responsive design
   - Declarative JSX
   - Proper component typing with interfaces

## Development Workflow
- Development: `bun run dev`
- Building: `bun run build`
- Linting: `bun run lint`
- Registry building: `bun run registry:build`

## Additional Context
- The project appears to be a banking toolkit with a focus on developer experience
- Documentation is a key part of the project
- CLI tool suggests automation capabilities
- Shared UI components indicate a design system approach
- Modern development practices and tools are used throughout

This context is designed to help LLMs understand the project structure, conventions, and technical decisions when assisting with development tasks. 