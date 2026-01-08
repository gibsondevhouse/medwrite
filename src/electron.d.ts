export interface IElectronAPI {
  loadPreferences: () => Promise<void>,
  saveFile: (path: string, content: string) => Promise<void>,
  readFile: (path: string) => Promise<string>,
  showSaveDialog: () => Promise<string | null>,
  showOpenDialog: () => Promise<string | null>,
  minimize: () => Promise<void>,
  maximize: () => Promise<void>,
  close: () => Promise<void>,
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
