import { useEditor, EditorContent } from '@tiptap/react'
import { getEditorExtensions } from './extensions'
import BubbleMenu from './BubbleMenu'
import SlashCommandsMenu from './SlashCommandsMenu'

/**
 * Core Editor Component
 * Contains all editor logic and functionality
 */
export default function Editor() {
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-screen p-8',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="relative w-full h-full">
      <BubbleMenu editor={editor} />
      <div className="relative">
        <SlashCommandsMenu editor={editor} />
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}
