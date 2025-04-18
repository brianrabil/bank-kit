# Bank Kit UI Library Context

## Overview
The Bank Kit UI library is a comprehensive component library built on top of Shadcn UI, providing a consistent and accessible design system for banking applications. It's designed to be used across the Bank Kit ecosystem.

## Package Structure
```
packages/ui/
├── src/
│   ├── components/     # Reusable UI components
│   ├── patterns/       # Complex component patterns
│   ├── styles/         # Global styles and themes
│   ├── lib/           # Utility functions and helpers
│   └── hooks/         # Custom React hooks
```

## Technical Stack
- **Base Framework**: React 19
- **Component Foundation**: Radix UI primitives
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form + Zod
- **Data Display**: TanStack Table
- **Data Fetching**: TanStack Query
- **Date Handling**: date-fns + react-day-picker
- **Charts**: Recharts
- **Animations**: tailwindcss-animate
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Validation**: Zod
- **UI Utilities**: 
  - class-variance-authority (for component variants)
  - clsx & tailwind-merge (for class name management)
  - cmdk (for command palette)

## Component Categories

### Core Components
- Accordion
- Alert Dialog
- Aspect Ratio
- Avatar
- Checkbox
- Collapsible
- Context Menu
- Dialog
- Dropdown Menu
- Hover Card
- Label
- Menubar
- Navigation Menu
- Popover
- Progress
- Radio Group
- Scroll Area
- Select
- Separator
- Slider
- Switch
- Tabs
- Toggle
- Toggle Group
- Tooltip

### Advanced Patterns
- Command Palette
- Data Tables
- Date Pickers
- Form Components
- Charts
- Notifications
- Resizable Panels
- Drawers (Vaul)

## Design Principles
1. **Accessibility First**
   - Built on Radix UI primitives
   - ARIA compliant
   - Keyboard navigation support

2. **Customization**
   - Themeable components
   - Variant support via class-variance-authority
   - Consistent styling with Tailwind

3. **Type Safety**
   - Full TypeScript support
   - Zod schema validation
   - Proper prop typing

4. **Performance**
   - Optimized bundle size
   - Lazy loading support
   - Efficient re-renders

## Usage Guidelines

### Component Implementation
```typescript
// Example component structure
import { cn } from "../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        // ... other variants
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ComponentProps extends VariantProps<typeof componentVariants> {
  // ... component specific props
}

export function Component({ className, variant, ...props }: ComponentProps) {
  return (
    <div className={cn(componentVariants({ variant }), className)} {...props} />
  )
}
```

### Styling Conventions
- Use Tailwind classes for styling
- Follow mobile-first approach
- Utilize theme tokens for consistency
- Implement dark mode support

### Best Practices
1. **Component Design**
   - Use composition over inheritance
   - Implement proper prop types
   - Include proper documentation
   - Add proper aria labels

2. **State Management**
   - Use React hooks for local state
   - Implement controlled/uncontrolled patterns
   - Handle loading and error states

3. **Performance**
   - Memoize expensive computations
   - Use proper React patterns
   - Implement proper loading states

## Development Workflow
1. **Adding New Components**
   - Follow existing component patterns
   - Include proper TypeScript types
   - Add necessary tests
   - Update documentation

2. **Modifying Existing Components**
   - Maintain backward compatibility
   - Update types and documentation
   - Test across different use cases

3. **Styling Updates**
   - Use theme tokens
   - Follow Tailwind conventions
   - Maintain accessibility

## Integration Guidelines
1. **Installation**
   ```bash
   # In your app's package.json
   {
     "dependencies": {
       "@bank-kit/ui": "workspace:*"
     }
   }
   ```

2. **Setup**
   ```typescript
   // Import global styles
   import "@bank-kit/ui/globals.css"
   
   // Import components
   import { Button } from "@bank-kit/ui/components/button"
   ```

3. **Theme Configuration**
   - Extend Tailwind config
   - Customize theme tokens
   - Implement dark mode

This context is designed to help developers understand and effectively use the Bank Kit UI library while maintaining consistency and best practices. 