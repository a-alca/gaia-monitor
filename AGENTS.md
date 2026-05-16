# Gaia Monitor - Agent Instructions

## Project Overview

Gaia Monitor is a modern environmental monitoring dashboard built with Next.js 16, React 19, TypeScript, and TailwindCSS 4. It provides real-time monitoring of climate, wildfires, air quality, and territorial data with a dark, futuristic aesthetic.

## Critical Requirements

### Node.js Version
- **Required: Node.js 20.9.0 or higher**
- Next.js 16 strictly requires Node.js >=20.9.0
- The project includes a `.nvmrc` file for easy version management
- Always check Node.js version before running commands

### Technology Stack
- Next.js 16 (App Router) - **Breaking changes from previous versions**
- React 19
- TypeScript 5
- TailwindCSS 4 (new syntax with `@import "tailwindcss"` and `@theme inline`)
- Zustand for state management
- Framer Motion for animations
- Leaflet for maps
- SQLite for local persistence

## Project Structure

```
src/
├── app/                    # Next.js App Router (file-system based)
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with TailwindCSS 4
├── components/
│   ├── layout/            # Layout components
│   ├── widgets/           # Dashboard widgets
│   └── dashboard/         # Dashboard-specific components
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
└── services/              # API services
```

## Design System

### Color Palette (Dark Theme)
- Background: #050505 (deep black)
- Foreground: #ededed
- Primary: #2d5a27 (forest green)
- Secondary: #4a5d23 (olive)
- Accent: #6b7a3d (moss)
- Amber: #d4a574 (soft amber for highlights)
- Border: #1f1f1f (graphite)
- Muted: #27272a

### Design Principles
- Dark mode native (no light mode)
- Clean, contemplative interface
- Low visual pollution
- Soft transparencies and blur effects
- Slow, smooth animations
- Technical and elegant aesthetic

## Component Patterns

### Widgets
All widgets follow this pattern:
```typescript
'use client'; // Required for components using hooks

import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';
import { DataType } from '@/types';

interface WidgetProps {
  data?: DataType;
}

export function Widget({ data }: WidgetProps) {
  const mockData: DataType = { /* ... */ };
  const widgetData = data || mockData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
    >
      {/* Widget content */}
    </motion.div>
  );
}
```

### State Management
Use Zustand stores located in `src/stores/`:
```typescript
import { useStore } from '@/stores/store';

function Component() {
  const { state, setState } = useStore();
  // ...
}
```

## Development Guidelines

### File Naming
- Use PascalCase for components: `ClimateWidget.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for folders when appropriate

### TypeScript
- Always type props and return values
- Use interfaces for object shapes
- Use type aliases for union types
- Leverage the existing types in `src/types/index.ts`

### TailwindCSS 4
- Use the new `@import "tailwindcss"` syntax
- Define custom colors in `@theme inline` block in globals.css
- Use CSS variables for theming
- No tailwind.config.js needed with v4

### Styling
- Prefer utility classes over custom CSS
- Use the `cn()` utility for conditional classes
- Maintain consistency with existing components
- Follow the dark theme color palette

## Testing Before Deploying

1. Check Node.js version: `node --version` (must be >=20.9.0)
2. Install dependencies: `npm install`
3. Run type check: `npm run type-check`
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Build project: `npm run build`
7. Start production server: `npm start`

## Common Issues

### Build Errors
- **Node.js version**: Always ensure Node.js >=20.9.0
- **Type errors**: Run `npm run type-check` to identify issues
- **Import errors**: Check file paths and use `@/` alias for src directory

### Styling Issues
- **TailwindCSS 4**: Ensure you're using the new syntax
- **Dark mode**: The app is dark-mode only, no light mode support
- **Custom colors**: Use CSS variables defined in globals.css

### Map Issues
- **Leaflet SSR**: Map components must be client-side only ('use client')
- **Markers**: Default marker icons need special handling in Next.js

## Adding New Features

1. **New Widget**: Create in `src/components/widgets/`, follow existing patterns
2. **New Page**: Create folder in `src/app/`, add `page.tsx`, update Sidebar navigation
3. **New Store**: Create in `src/stores/`, follow existing patterns
4. **New API**: Create service in `src/services/`, add types in `src/types/`

## Performance Considerations

- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use lazy loading for heavy components
- Leverage Next.js built-in optimizations

## Accessibility

- Ensure sufficient color contrast
- Add aria-labels to interactive elements
- Support keyboard navigation
- Use semantic HTML elements
- Test with screen readers when possible

## Deployment

The project includes Docker configuration:
- `Dockerfile`: For containerized deployment
- `docker-compose.yml`: For development and production setups
- Use Node.js 20+ in Docker images

## Future Enhancements

Planned features that need architecture consideration:
- Local AI integration
- Predictive analytics
- Automated environmental scraping
- Offline synchronization
- IoT sensor integration
- Public API ingestion
- Push notification system
- Automated report generation