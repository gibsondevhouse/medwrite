# Contributing to MedWrite

Thank you for your interest in contributing to MedWrite! This document provides guidelines and information for contributors.

## Architecture Principles

MedWrite follows strict architectural patterns to maintain modularity and prevent monolithic code:

### 1. App.tsx - Providers ONLY
- Should only contain provider components (Context providers, Router, etc.)
- No logic, layout, or UI components
- All functionality is delegated to child components

### 2. Layouts (src/layouts/)
- Handles shell/layout concerns
- Manages application-wide UI state (e.g., Zen mode)
- Contains no business logic or editor functionality

### 3. Components (src/components/)
- Granular, focused components
- Each component has a single responsibility
- Editor components are isolated in `src/components/editor/`

### 4. Electron Process Separation
- **Main Process** (`src/electron/main.ts`): Window management, native APIs
- **Preload Script** (`src/electron/preload.ts`): Secure IPC bridge
- **Renderer Process** (React app): UI and user interactions

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/gibsondevhouse/medwrite.git
cd medwrite
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Code Style Guidelines

- **TypeScript**: All code must be written in TypeScript
- **Formatting**: Use consistent formatting (no trailing semicolons, single quotes)
- **Naming**: Use descriptive, clear variable and function names
- **Comments**: Add JSDoc comments for components and exported functions

## Component Structure

When creating new components:

```typescript
import { useState } from 'react'

interface MyComponentProps {
  // Define props
}

/**
 * Component description
 */
export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Component logic
  return (
    // JSX
  )
}
```

## Adding TipTap Extensions

1. Create the extension in `src/components/editor/extensions.ts`
2. Export it from `getEditorExtensions()`
3. Test the extension thoroughly

## Testing Changes

1. Run TypeScript compilation:
```bash
npx tsc --noEmit
```

2. Build the application:
```bash
npm run build
```

3. Test in development mode:
```bash
npm run dev
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the architecture principles
3. Test your changes thoroughly
4. Submit a pull request with a clear description

## Security

- Never commit secrets or API keys
- Use the preload script for IPC communication
- Follow Electron security best practices
- Report security issues privately

## Questions?

Feel free to open an issue for any questions or concerns!
