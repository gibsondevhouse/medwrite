import { useState } from 'react'
import Editor from '../components/editor/Editor'

/**
 * Main Layout Component
 * Shell/Layout logic with Zen mode support
 */
export default function MainLayout() {
  const [isZenMode, setIsZenMode] = useState(false)

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
              title="Enter Zen Mode"
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

      {/* Zen mode toggle - Appears on hover in Zen mode */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white rounded-md shadow-sm backdrop-blur-sm transition-all opacity-0 hover:opacity-100"
          title="Exit Zen Mode"
        >
          Exit Focus
        </button>
      )}
    </div>
  )
}
