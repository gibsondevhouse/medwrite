import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'
import { Editor } from '@tiptap/react'

interface BubbleMenuProps {
  editor: Editor
}

/**
 * Bubble Menu Component
 * Shows formatting options when text is selected
 */
export default function BubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <TiptapBubbleMenu
      editor={editor}
      className="bg-gray-900 text-white rounded-lg shadow-lg flex items-center gap-1 px-2 py-1"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-700' : ''
        }`}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-700' : ''
        }`}
        title="Italic"
      >
        <span className="italic">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('strike') ? 'bg-gray-700' : ''
        }`}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </button>
      <div className="w-px h-6 bg-gray-600 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('code') ? 'bg-gray-700' : ''
        }`}
        title="Code"
      >
        <span className="font-mono text-sm">&lt;/&gt;</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-700' : ''
        }`}
        title="Heading 1"
      >
        <span className="font-bold">H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-700' : ''
        }`}
        title="Heading 2"
      >
        <span className="font-bold">H2</span>
      </button>
    </TiptapBubbleMenu>
  )
}
