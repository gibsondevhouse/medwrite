# Build Process Documentation

## Objective
This document outlines the end-to-end build process for MedWrite, ensuring consistent and reproducible builds for distribution.

## Prerequisites
To build the application, ensure the following software is installed on your system:
- **Node.js**: Version 20 or higher is required for compatibility with current dependencies.
- **npm**: Typically bundled with Node.js.
- **Operating System Specifics**:
  - **Windows**: No additional tools required for standard NSIS builds.
  - **macOS**: Xcode Command Line Tools may be required for code signing (if configured).
  - **Linux**: `libarchive-tools` or equivalent might be needed for certain targets like AppImage.

## Build Steps
The build process is automated through npm scripts defined in `package.json`. Follow these steps in sequence:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    Ensures all required libraries (React, Electron, TipTap, Vite) are available.

2.  **Compile and Package**:
    ```bash
    npm run build
    ```
    This command executes a multi-stage process:
    - `tsc`: Runs the TypeScript compiler to perform type checking.
    - `vite build`: Bundles the React frontend (renderer process) into the `dist/` directory.
    - `electron-builder`: Compiles the Electron main/preload scripts and packages the entire application into an executable.

## Configuration
The build is primarily configured via `package.json` under the `build` key:

- **App ID**: `com.medwrite.app`
- **Product Name**: `MedWrite`
- **Output Directory**: Configured to `release/`.
- **Targets**:
  - **Windows**: Generates an `.exe` (NSIS installer).
  - **macOS**: Generates a `.dmg` file.
  - **Linux**: Generates an `.AppImage` file.

Vite-specific configurations (like ESM handling and Electron plugins) are managed in `vite.config.ts`.

## Output
Upon a successful build, the following artifacts can be found in the `release/` directory:
- **Executables**: Platform-specific installers (e.g., `MedWrite Setup 1.0.0.exe`, `MedWrite-1.0.0.dmg`).
- **Unpacked Resources**: The `dist/` and `dist-electron/` folders contain the raw bundled code used by Electron.

## Troubleshooting

### Common Issues
- **`Require` is not defined**: This often occurs if `main.ts` or `preload.ts` contains CommonJS syntax while the project is set to `"type": "module"`. Ensure all modules are imported using ESM `import` statements.
- **GPU Acceleration Crashes**: On older Windows systems (Win 7/8), the app might fail to launch. The build includes a check for `os.release()` to disable hardware acceleration automatically on these platforms.
- **Missing Build Tools**: If `electron-builder` fails on Linux or macOS, ensure system-level dependencies for packaging (like `rpm` or `dmgbuild`) are installed.

### Resolution
- Clear the cache and reinstall: `rm -rf node_modules && npm install`.
- Ensure `dist-electron/` is deleted before a fresh build if stale files persist.
