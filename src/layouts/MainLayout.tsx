import { useState, useEffect, useRef } from 'react'
import Editor, { EditorRef } from '../components/editor/Editor'

/**
 * Main Layout Component
 * Shell/Layout logic with Zen mode support
 */
export default function MainLayout() {
  const [isZenMode, setIsZenMode] = useState(false)
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const editorRef = useRef<EditorRef>(null)

  // Keyboard shortcut: Cmd/Ctrl + Shift + F to toggle Zen mode
  // Cmd/Ctrl + S to Save
  // Cmd/Ctrl + O to Open
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Zen Mode
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault()
        setIsZenMode((prev) => !prev)
      }
      
      // Save
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        await handleSave()
      }

      // Open
      if ((event.metaKey || event.ctrlKey) && event.key === 'o') {
        event.preventDefault()
        await handleOpen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentFilePath]) // Dependency on currentFilePath for Save logic

  const handleSave = async () => {
    const content = editorRef.current?.getMarkdown()
    const title = editorRef.current?.getTitle() || 'Untitled'
    
    // Combine Title and Content for saving
    const fullContent = `# ${title}\n\n${content}`
    
    if (!content && !title) return

    let path = currentFilePath
    if (!path) {
      // Suggest filename based on title
      // const defaultPath = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.md'
      path = await window.electron.showSaveDialog() // We might want to pass defaultPath to showSaveDialog if we update the API
    }

    if (path) {
      await window.electron.saveFile(path, fullContent)
      setCurrentFilePath(path)
      setIsDirty(false)
    }
  }

  const handleOpen = async () => {
    // TODO: Confirm if dirty?
    const path = await window.electron.showOpenDialog()
    if (path) {
      const fullContent = await window.electron.readFile(path)
      
      // Parse Title (first line #)
      const match = fullContent.match(/^# (.*)\n/)
      let title = ''
      let body = fullContent
      
      if (match) {
        title = match[1]
        body = fullContent.slice(match[0].length)
      } else {
        // Fallback: Use filename as title if no H1 found
        title = path.split(/[\\/]/).pop()?.replace('.md', '') || 'Untitled'
      }

      editorRef.current?.setTitle(title)
      editorRef.current?.setMarkdown(body)
      
      setCurrentFilePath(path)
      setIsDirty(false)
    }
  }

  const handleContentUpdate = (_content: string) => {
    if (!isDirty) setIsDirty(true)
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header - Hidden in Zen mode */}
      {!isZenMode && (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 drag-region">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 font-['Noe_Display']">
              Khuilium
              {currentFilePath && <span className="text-sm font-normal text-gray-500 ml-2 font-sans">
                - {currentFilePath.split(/[\\/]/).pop()} {isDirty ? '*' : ''}
              </span>}
            </h1>
          </div>
          <div className="flex items-center gap-2 no-drag">
            <button
              onClick={handleOpen}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Open
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors"
            >
              Save
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={() => setIsZenMode(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Enter Zen Mode (Cmd/Ctrl+Shift+F)"
            >
              Focus Mode
            </button>
          </div>
          
          {/* Window Controls */}
          <div className="flex items-center gap-1 no-drag ml-4 pl-4 border-l border-gray-200">
            <button
              onClick={() => window.electron.minimize()}
              className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
              title="Minimize"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button
              onClick={() => window.electron.maximize()}
              className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
              title="Maximize"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
            </button>
            <button
              onClick={() => window.electron.close()}
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
              title="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <Editor ref={editorRef} onUpdate={handleContentUpdate} />
        </div>
      </main>

      {/* Zen mode toggle - Semi-transparent, fully visible on hover/focus */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white/50 hover:bg-white rounded-md shadow-sm backdrop-blur-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          title="Exit Zen Mode (Cmd/Ctrl+Shift+F)"
          aria-label="Exit Zen Mode"
        >
          Exit Focus
        </button>
      )}
    </div>
  )
}
