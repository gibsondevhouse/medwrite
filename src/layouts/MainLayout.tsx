import { useState, useEffect } from 'react'
import Editor from '../components/editor/Editor'

/**
 * Main Layout Component
 * Shell/Layout logic with Zen mode support
 */
export default function MainLayout() {
  const [isZenMode, setIsZenMode] = useState(false)

  // Keyboard shortcut: Cmd/Ctrl + Shift + F to toggle Zen mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault()
        setIsZenMode((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header - Hidden in Zen mode */}
      {!isZenMode && (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 drag-region">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">MedWrite</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZenMode(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Enter Zen Mode (Cmd/Ctrl+Shift+F)"
            >
              Focus Mode
            </button>
          </div>
        </header>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <Editor />
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
