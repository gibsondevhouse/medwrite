# Medium Dogfooding Plan

This document outlines the strategy for extracting design tokens and specifications from the `Medium.html` research file to authentically replicate the Medium reading/writing experience in MedWrite.

## Objective
To "dogfood" the Medium design language by analyzing their actual production HTML/CSS and applying those precise values to our Tailwind configuration and TipTap editor styles.

---

## Phase 1: Typography Extraction
*Goal: Replicate the typographic hierarchy and feel.*

### 1.1. Font Families
-   **Sans-Serif (UI):** Identify the exact stack used for UI elements (menus, buttons, sidebar).
    -   *Target:* `.a` class or similar root definitions.
    -   *Current Finding:* `medium-content-sans-serif-font, -apple-system, BlinkMacSystemFont, "Segoe UI", ...`
-   **Serif (Body):** Identify the font stack used for article body text.
    -   *Target:* Look for `charter`, `georgia`, or specific font imports.
-   **Headings:** Determine if headings use a different stack (e.g., `sohne`).

### 1.2. Typescale
-   **H1 (Title):** Extract font-size, line-height, and font-weight.
-   **H2 - H6:** Extract cascading sizes.
-   **Body Text:** Precise `font-size` (likely 16px-21px) and `line-height` (usually 1.5 - 1.6).
-   **Caption/Small:** Sizes for image captions or meta text (12px-14px).

---

## Phase 2: Color Palette Extraction
*Goal: Define the semantic color system.*

### 2.1. Grayscale
-   **Background:** App background vs. Card background.
-   **Text Primary:** The "almost black" used for body text (e.g., `#242424`).
-   **Text Secondary:** The gray used for subtitles and meta info (e.g., `#6B6B6B`).
-   **Border/Divider:** The subtle gray lines (e.g., `#F2F2F2`).

### 2.2. Accents
-   **Brand Color:** The specific Medium logo black or green.
-   **Action Color:** Color for buttons (Follow, Publish) - usually Green `#1a8917` or Blue `#1a73e8` (from analysis).
-   **Selection:** What color is the text selection background?

---

## Phase 3: Layout & Spacing
*Goal: Nail the "Zen" reading column.*

### 3.1. Containers
-   **Reading Column Width:** The exact pixel width of the main content area (likely `680px` or `700px`).
-   **Full Width:** Max-width for the shell (`1336px`?).

### 3.2. Spacing
-   **Vertical Rhythm:** Spacing between paragraphs (`p + p`), before/after headers (`h1 + p`).
-   **Inset:** Padding on mobile vs. desktop (`24px`?).

---

## Phase 4: Component Styling
*Goal: Polish specific UI elements.*

### 4.1. Buttons
-   Border radius (pill shape vs. rounded rect).
-   Padding (vertical/horizontal).
-   Hover states.

### 4.2. Editor Specifics
-   **Blockquote:** Border styling (left border width, color, padding).
-   **Code Block:** Background color, font family.
-   **Image Captions:** Center alignment, styling.

---

## Execution Strategy
1.  **Analyze:** Use regex and manual inspection on `Medium.html` to fill in the values above.
2.  **Map:** Map these values to `tailwind.config.js` (extending the theme).
3.  **Apply:** Update `Editor.tsx` and `index.css` to use these new utility classes.
4.  **Verify:** Visually compare MedWrite against the `Medium.html` reference.
