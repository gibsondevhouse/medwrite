import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs/promises'

// Disable GPU Acceleration for Windows 7
if (process.platform === 'win32' && Number(os.release().split('.')[0]) < 10) {
  app.disableHardwareAcceleration()
}

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName())
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'hidden',
    frame: false,
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  // File System IPC Handlers
  ipcMain.handle('fs:save-file', async (_, filePath: string, content: string) => {
    try {
      await fs.writeFile(filePath, content, 'utf-8')
    } catch (error) {
      console.error('Failed to save file:', error)
      throw error
    }
  })

  ipcMain.handle('fs:read-file', async (_, filePath: string) => {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      console.error('Failed to read file:', error)
      throw error
    }
  })

  ipcMain.handle('dialog:save-file', async () => {
    const { filePath } = await dialog.showSaveDialog({
      buttonLabel: 'Save',
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    })
    return filePath || null
  })

  ipcMain.handle('dialog:open-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    })
    return filePaths[0] || null
  })

  // Window Controls
  ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize()
  })
  
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })
  
  ipcMain.handle('window:close', () => {
    mainWindow?.close()
  })

  // Set Application Menu
  const isMac = process.platform === 'darwin'
  const template: any[] = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
