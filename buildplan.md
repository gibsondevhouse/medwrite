# MedWrite Implementation Plan

This document outlines the roadmap to complete MedWrite, transforming it from a prototype into a fully functional, local-first Markdown editor.

## Phase 1: Core Editor Features (✅ Mostly Complete)
The foundation of the editor is in place.
- [x] **TipTap Integration:** Basic rich text editing with `StarterKit`.
- [x] **Slash Commands:** UI overlay for inserting headers, images, etc.
- [x] **Bubble Menu:** Contextual formatting (Bold, Italic) on selection.
- [x] **Image Handling:** Drag & drop and Paste support (converted to Base64).
- [x] **Zen Mode:** Distraction-free toggle.

## Phase 2: File System & Persistence (🚧 High Priority)
Currently, the app only "exports" via a browser download. To be a true desktop editor, it needs deep OS integration.

### 2.1. Markdown Serialization
The current export uses `innerText`, which strips formatting.
- [ ] **Add `tiptap-markdown`:** Install and configure the extension to convert TipTap's JSON/HTML state to valid `.md` text.
- [ ] **Update Editor:** Ensure the editor reads/writes Markdown, not just HTML.

### 2.2. Electron IPC Bridge
Secure communication between the React renderer and Node.js main process.
- [ ] **Define Channels:**
    - `fs:save-file(path, content)`
    - `fs:read-file(path)`
    - `dialog:open-file()`
    - `dialog:save-file()`
- [ ] **Update `preload.ts`:** Expose these methods via `window.electron`.
- [ ] **Update `main.ts`:** Implement the handlers using Node's `fs` and `dialog` modules.

### 2.3. Document Management UI
- [ ] **Title Management:** Add a document title input (maps to filename or H1).
- [ ] **File Operations:**
    - Replace "Export" button with **Save** (Ctrl+S) and **Open** (Ctrl+O).
    - Add "Save As" functionality.
- [ ] **State Tracking:** Track `currentFilePath` in React state to know if we are editing a new or existing file.

## Phase 3: Polish & Experience (🎨 Refinement)
- [ ] **Typography:** Refine Tailwind typography (line-height, font-family) to closely match Medium's aesthetic.
- [ ] **Scroll Sync:** Ensure large documents scroll smoothly.
- [ ] **App Menu:** Update the native OS menu (File, Edit, View) to trigger renderer actions (like "Toggle Zen Mode").

## Phase 4: Packaging & Distribution (📦 Release)
- [ ] **Iconography:** Add proper app icons for Windows/Mac/Linux.
- [ ] **Build Check:** Verify `npm run build` produces valid executables (using existing `buildprog.md` workflow).
- [ ] **Smoke Test:** Validate the installer on a clean VM/environment.

## Immediate Next Steps
1.  **Install `tiptap-markdown`** to enable real Markdown support.
2.  **Implement IPC handlers** in `src/electron/main.ts` for file I/O.
