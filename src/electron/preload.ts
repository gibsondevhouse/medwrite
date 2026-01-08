import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  loadPreferences: () => ipcRenderer.invoke('load-preferences'),
  saveFile: (path: string, content: string) => ipcRenderer.invoke('fs:save-file', path, content),
  readFile: (path: string) => ipcRenderer.invoke('fs:read-file', path),
  showSaveDialog: () => ipcRenderer.invoke('dialog:save-file'),
  showOpenDialog: () => ipcRenderer.invoke('dialog:open-file'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
})
