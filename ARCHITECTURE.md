# Architecture Documentation

## Overview

MedWrite is built with a strict architectural pattern that enforces separation of concerns and prevents monolithic code structures.

## Core Principles

### 1. Single Responsibility
Each file and component has a single, well-defined responsibility.

### 2. Clear Boundaries
- **Providers**: App.tsx only
- **Shell/Layout**: src/layouts/ directory
- **Core Logic**: src/components/ directory
- **Electron**: src/electron/ directory

### 3. Modularity
Components and extensions are designed to be modular and reusable.

## Directory Structure

```
medwrite/
├── src/
│   ├── App.tsx                          # Application root (providers only)
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Global styles
│   ├── electron.d.ts                    # Electron type definitions
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx               # Shell: Header, Zen mode, layout
│   │
│   ├── components/
│   │   └── editor/
│   │       ├── Editor.tsx               # Core editor component
│   │       ├── BubbleMenu.tsx           # Text highlighting menu
│   │       ├── SlashCommandsMenu.tsx    # Slash command overlay
│   │       └── extensions.ts            # TipTap extensions
│   │
│   └── electron/
│       ├── main.ts                      # Electron main process
│       └── preload.ts                   # Preload script (IPC bridge)
│
├── public/                              # Static assets
├── dist/                                # Vite build output
├── dist-electron/                       # Electron build output
└── release/                             # Packaged application
```

## Component Hierarchy

```
App (Providers Only)
└── MainLayout (Shell/Layout)
    └── Editor (Core)
        ├── BubbleMenu
        └── SlashCommandsMenu
```

## Data Flow

1. **User Input** → Editor Component
2. **Editor State** → TipTap extensions
3. **Commands** → Modular extension handlers
4. **UI State** (Zen mode) → MainLayout

## Electron Architecture

### Main Process (src/electron/main.ts)
- Window management
- Application lifecycle
- Native system integration
- No direct access to renderer process

### Preload Script (src/electron/preload.ts)
- Secure IPC bridge using contextBridge
- Exposes limited, safe APIs to renderer
- Maintains context isolation

### Renderer Process (React App)
- All UI components
- User interactions
- Editor logic
- Limited access to Electron APIs through preload

## Extension System

Extensions are modular units that add functionality to the TipTap editor:

### Built-in Extensions
1. **StarterKit**: Core editing features
2. **Placeholder**: Empty editor placeholder
3. **Image**: Image insertion and display
4. **SlashCommands**: Custom extension for slash command detection
5. **ImageDropHandler**: Custom extension for drag-drop image handling

### Adding New Extensions

```typescript
// In src/components/editor/extensions.ts

export const MyExtension = Extension.create({
  name: 'myExtension',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('myExtension'),
        // Plugin implementation
      }),
    ]
  },
})

// Add to getEditorExtensions()
export const getEditorExtensions = () => [
  // ... other extensions
  MyExtension,
]
```

## State Management

- **Local Component State**: React useState for UI state
- **Editor State**: TipTap manages document state
- **No Global State**: Each component manages its own state

## Styling Strategy

- **Tailwind CSS**: Utility-first CSS framework
- **Tailwind v4**: Using @import syntax
- **Component Styles**: Inline Tailwind classes
- **Global Styles**: Minimal, in src/index.css

## Build Process

1. **TypeScript Compilation**: `tsc` validates types
2. **Vite Build**: Bundles React application
3. **Electron Build**: Packages main and preload scripts
4. **electron-builder**: Creates distributable packages

## Security Considerations

1. **Context Isolation**: Enabled in main.ts
2. **Node Integration**: Disabled for renderer
3. **Preload Script**: Only way to access Node APIs
4. **Content Security**: No eval, inline scripts limited

## Performance Optimizations

1. **Code Splitting**: Vite handles automatic splitting
2. **Lazy Loading**: Extensions loaded on-demand
3. **Base64 Images**: Keep images local-first
4. **Minimal Dependencies**: Only essential packages

## Testing Strategy

1. **Type Safety**: TypeScript compilation
2. **Build Verification**: Production builds
3. **Manual Testing**: UI and functionality testing

## Future Extensibility

The architecture supports:
- Additional TipTap extensions
- New layout modes beyond Zen mode
- Plugin system for community extensions
- Custom themes and styling
- Local persistence layer
- Markdown export functionality

## Anti-Patterns to Avoid

❌ Don't add logic to App.tsx
❌ Don't create monolithic components
❌ Don't bypass the preload script for IPC
❌ Don't mix layout and business logic
❌ Don't use global state without justification

✅ Do keep components focused
✅ Do use modular extensions
✅ Do maintain clear boundaries
✅ Do follow the established patterns
✅ Do document new architectural decisions
