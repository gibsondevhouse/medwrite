# MedWrite

A local-first Markdown Medium editor built with Electron, React, Vite, Tailwind CSS, and TipTap.

## Features

- **Zen Mode**: Distraction-free writing experience
- **TipTap Editor**: Rich text editing with Markdown support
- **Bubble Menu**: Contextual formatting toolbar on text selection
- **Slash Commands**: Quick formatting with `/h1`, `/h2`, `/img`, etc.
- **Drag & Drop Images**: Drop images directly into the editor (Base64 encoded)
- **Modular Architecture**: Clean separation of concerns with strict architectural patterns

## Architecture

The application follows a strict architectural pattern to maintain modularity and prevent monolithic code:

```
src/
├── App.tsx                          # Providers ONLY
├── layouts/
│   └── MainLayout.tsx               # Shell/Layout logic
├── components/
│   └── editor/
│       ├── Editor.tsx               # Core editor component
│       ├── BubbleMenu.tsx           # Text highlighting menu
│       ├── SlashCommandsMenu.tsx    # Slash commands overlay
│       └── extensions.ts            # Modular TipTap extensions
└── electron/
    ├── main.ts                      # Electron main process
    └── preload.ts                   # Electron preload script
```

### Key Principles

1. **App.tsx**: Contains only providers, no logic or layout
2. **MainLayout.tsx**: Handles shell/layout concerns (Zen mode, header, etc.)
3. **Editor.tsx**: Contains core editor functionality
4. **extensions.ts**: Modular, reusable TipTap extensions
5. **Clean Main/Renderer separation**: Proper Electron process isolation

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This will start both Vite dev server and Electron in development mode.

### Build

Build the application for production:

```bash
npm run build
```

This will create distributable packages in the `release/` directory.

## Usage

### Slash Commands

Type `/` anywhere in the editor to open the command menu:

- `/h1` - Large heading
- `/h2` - Medium heading
- `/h3` - Small heading
- `/img` - Insert image (opens file picker)
- `/bold` - Bold text
- `/italic` - Italic text
- `/code` - Code block
- `/quote` - Block quote

### Bubble Menu

Select any text to see the bubble menu with formatting options:
- **B** - Bold
- **I** - Italic
- **S** - Strikethrough
- **</>** - Code
- **H1/H2** - Headings

### Image Handling

Drop image files directly into the editor or use the `/img` slash command. Images are converted to Base64 for local-first storage.

### Zen Mode

Click "Focus Mode" in the header to enter a distraction-free writing environment. Hover over the top-right corner to reveal the "Exit Focus" button.

## Technology Stack

- **Electron**: Desktop application framework
- **React**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **TipTap**: Headless rich text editor
- **TypeScript**: Type-safe JavaScript

## License

ISC
