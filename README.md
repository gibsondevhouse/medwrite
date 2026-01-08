# Khuilium

Khuilium is a local-first, distraction-free Markdown editor designed to mimic the fluid writing experience of Medium. Built with Electron, React, Vite, Tailwind CSS, and TipTap.

![Khuilium Screenshot](https://via.placeholder.com/800x500?text=Khuilium+Preview)

## Features

-   **Zen Mode:** A focused, header-less writing environment (`Ctrl+Shift+F`).
-   **Medium-Style Editing:**
    -   Slash commands (`/h1`, `/img`, `/code`, etc.).
    -   Bubble menu for text formatting (Bold, Italic, Link).
    -   Clean, centered typography.
-   **Local-First:**
    -   Full File System access (Open, Save, Save As).
    -   Real Markdown (`.md`) storage.
    -   Images stored inline as Base64 (portability).
-   **Smart Title Management:** Dedicated title field that maps to the document's H1.
-   **Custom UI:** Frameless window with custom minimize/maximize/close controls.

## Tech Stack

-   **Runtime:** Electron (CommonJS Main/Preload)
-   **Frontend:** React 19 + Vite
-   **Styling:** Tailwind CSS 4
-   **Editor:** TipTap + `tiptap-markdown`

## Development

### Prerequisites
-   Node.js v20+
-   npm

### Setup
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Run
Start the development server (Hot Reload enabled):
```bash
npm run dev
```

### Build
Package the application for production (creates `.exe`, `.dmg`, or `.AppImage`):
```bash
npm run build
```
Artifacts are output to the `release/` directory.

## Project Structure

-   `src/components/editor/`: Core editor logic (TipTap extensions, menus).
-   `src/electron/`: Main process and Preload scripts (Note: Compiled to CJS).
-   `src/layouts/`: App shell and window controls.
-   `src/App.tsx`: Provider setup.

## Key Shortcuts

-   **Save:** `Ctrl + S` / `Cmd + S`
-   **Open:** `Ctrl + O` / `Cmd + O`
-   **Zen Mode:** `Ctrl + Shift + F` / `Cmd + Shift + F`
-   **Slash Menu:** Type `/` at the start of a line.

## License

ISC