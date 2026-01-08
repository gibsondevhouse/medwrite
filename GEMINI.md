# Khuilium Context

## Project Overview

Khuilium is a local-first, distraction-free Markdown editor designed to mimic the writing experience of Medium. It is built as a desktop application using Electron, React, Vite, Tailwind CSS, and TipTap.

**Key Features:**
-   **Zen Mode:** A focused, header-less writing environment.
-   **Rich Text Editing:** Powered by TipTap, supporting Markdown syntax.
-   **Slash Commands:** Quick formatting (e.g., `/h1`, `/img`) similar to Notion/Medium.
-   **Bubble Menu:** Contextual formatting options (Bold, Italic, etc.) upon text selection.
-   **Local-First:** Images are handled via Base64 and stored locally within the document context.
-   **File System:** Native Open/Save dialogs via Electron IPC.
-   **Custom Window:** Frameless window with custom SVG controls.

## Architecture

The project adheres to a strict architectural pattern to ensure modularity and separation of concerns.

### Directory Structure
-   `src/App.tsx`: **Providers ONLY**. No business logic or layout code.
-   `src/layouts/MainLayout.tsx`: Handles the application shell, header, window controls, and file I/O orchestration.
-   `src/components/editor/`: Contains the core editor logic.
    -   `Editor.tsx`: Main editor component. Exposes `EditorRef` (getMarkdown, getTitle, setMarkdown) for parent control.
    -   `extensions.ts`: Modular TipTap extensions (including `tiptap-markdown`).
    -   `BubbleMenu.tsx` & `SlashCommandsMenu.tsx`: UI overlays.
-   `src/electron/`: Electron-specific code.
    -   `main.ts`: Main process. **Compiled to CJS**. Handles IPC (fs, window).
    -   `preload.ts`: Preload script. **Compiled to CJS**. Exposes `window.electron`.

### Build & Configuration
-   **Module System:** The project uses `"type": "module"`, BUT Electron scripts (`main`, `preload`) are forced to **CommonJS** (`.cjs`) via `vite.config.ts` (`ssr: true`, `lib` mode). This resolves import/export issues in the Electron sandbox.
-   **Styling:** Tailwind CSS (v4) with `@tailwindcss/typography`.
-   **IPC:**
    -   `fs:save-file`, `fs:read-file`
    -   `dialog:save-file`, `dialog:open-file`
    -   `window:minimize`, `window:maximize`, `window:close`

## Development Conventions

-   **State Management:** Prefer local component state (`useState`) or TipTap's internal state.
-   **Component Structure:** Keep components small and focused.
-   **Security:** Context isolation is enabled. No direct Node access in renderer.
-   **Typography:** Use `prose prose-lg prose-stone max-w-2xl mx-auto` for the editor container.
-   **Title Handling:** The document title is separate from the body in the UI but saved as the first `# H1` line in the file.

### Commands

*   `npm run dev`: Starts Vite dev server + Electron (Hot Reload).
*   `npm run build`: `tsc` + `vite build` + `electron-builder`.

## Status (Jan 2026)
-   ✅ Core Editor (TipTap, Markdown, Slash/Bubble menus)
-   ✅ File System (Open/Save/SaveAs)
-   ✅ Window Management (Custom Controls, Drag Region)
-   ✅ Smart Title (UI field <-> H1 mapping)
-   ✅ Native Menus (Hidden but active for shortcuts)