# MedWrite

## Project Overview

MedWrite is a local-first, distraction-free Markdown editor designed to mimic the writing experience of Medium. It is built as a desktop application using Electron, React, Vite, Tailwind CSS, and TipTap.

**Key Features:**
-   **Zen Mode:** A focused, header-less writing environment.
-   **Rich Text Editing:** Powered by TipTap, supporting Markdown syntax.
-   **Slash Commands:** Quick formatting (e.g., `/h1`, `/img`) similar to Notion/Medium.
-   **Bubble Menu:** Contextual formatting options (Bold, Italic, etc.) upon text selection.
-   **Local-First:** Images are handled via Base64 and stored locally within the document context.

## Architecture

The project adheres to a strict architectural pattern to ensure modularity and separation of concerns.

### Directory Structure
-   `src/App.tsx`: **Providers ONLY**. No business logic or layout code.
-   `src/layouts/MainLayout.tsx`: Handles the application shell, including the header and "Zen Mode" toggling.
-   `src/components/editor/`: Contains the core editor logic.
    -   `Editor.tsx`: The main editor component.
    -   `extensions.ts`: Modular TipTap extensions.
    -   `BubbleMenu.tsx` & `SlashCommandsMenu.tsx`: UI overlays for the editor.
-   `src/electron/`: Electron-specific code.
    -   `main.ts`: Main process (window management, system integration).
    -   `preload.ts`: Preload script for secure IPC bridging.

### Key Principles
-   **Strict Separation:** The renderer (React) has no direct access to Node.js APIs. Communication happens via the preload script.
-   **Modularity:** Editor features are implemented as discrete TipTap extensions.
-   **Styling:** Tailwind CSS (v4) is used for all styling. Global styles are minimal (`src/index.css`).

## Building and Running

### Prerequisites
-   Node.js (v20+)
-   npm

### Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    This starts the Vite dev server and launches the Electron app in development mode.

*   **Build for Production:**
    ```bash
    npm run build
    ```
    This compiles TypeScript, builds the Vite app, and packages the Electron application into the `release/` directory.

## Development Conventions

-   **State Management:** Prefer local component state (`useState`) or TipTap's internal state. Avoid global state libraries unless absolutely necessary.
-   **Component Structure:** Keep components small and focused. Split complex logic into hooks or utility functions.
-   **Styling:** Use Tailwind utility classes directly in components.
-   **Security:** Maintain context isolation. Do not enable Node integration in the renderer process.
-   **Anti-Patterns:**
    -   Do not add logic to `App.tsx`.
    -   Do not mix layout concerns with core editor logic.
    -   Do not bypass the secure IPC bridge.
