import { useEditor, EditorContent } from '@tiptap/react'
import { getEditorExtensions } from './extensions'
import BubbleMenu from './BubbleMenu'
import SlashCommandsMenu from './SlashCommandsMenu'
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'

export interface EditorRef {
  getMarkdown: () => string
  setMarkdown: (content: string) => void
  getTitle: () => string
  setTitle: (title: string) => void
}

interface EditorProps {
  initialContent?: string
  onUpdate?: (content: string) => void
}

/**
 * Core Editor Component
 * Contains all editor logic and functionality
 */
const Editor = forwardRef<EditorRef, EditorProps>(({ initialContent = '', onUpdate }, ref) => {
  const [title, setTitle] = useState('')
  
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-stone max-w-2xl mx-auto focus:outline-none min-h-[calc(100vh-200px)] pb-12 px-8',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.((editor.storage as any).markdown.getMarkdown())
    },
  })

  useImperativeHandle(ref, () => ({
    getMarkdown: () => {
      return (editor?.storage as any).markdown.getMarkdown() || ''
    },
    setMarkdown: (content: string) => {
      editor?.commands.setContent(content)
    },
    getTitle: () => title,
    setTitle: (newTitle: string) => setTitle(newTitle),
  }))

  // Update content if initialContent changes (e.g. file load)
  useEffect(() => {
    if (editor && initialContent !== (editor.storage as any).markdown.getMarkdown()) {
       if (!editor.isFocused) {
          editor.commands.setContent(initialContent)
       }
    }
  }, [initialContent, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <BubbleMenu editor={editor} />
      
      <div className="w-full max-w-2xl px-8 pt-12">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 bg-transparent p-0 mb-4 font-serif outline-none"
        />
      </div>

      <div className="relative w-full">
        <SlashCommandsMenu editor={editor} />
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
})

export default Editor
