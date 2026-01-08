import { useEffect, useState, useRef } from 'react'
import { Editor } from '@tiptap/react'

interface SlashCommandsMenuProps {
  editor: Editor
}

interface Command {
  title: string
  description: string
  command: () => void
}

/**
 * Slash Commands Menu Component
 * Shows available commands when user types /
 */
export default function SlashCommandsMenu({ editor }: SlashCommandsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [commands, setCommands] = useState<Command[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  // Define available commands
  const availableCommands: Command[] = [
    {
      title: '/h1',
      description: 'Large heading',
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: '/h2',
      description: 'Medium heading',
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: '/h3',
      description: 'Small heading',
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: '/img',
      description: 'Insert image',
      command: () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              const base64 = event.target?.result as string
              editor.chain().focus().setImage({ src: base64 }).run()
            }
            reader.readAsDataURL(file)
          }
        }
        input.click()
      },
    },
    {
      title: '/bold',
      description: 'Bold text',
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      title: '/italic',
      description: 'Italic text',
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      title: '/code',
      description: 'Code block',
      command: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: '/quote',
      description: 'Block quote',
      command: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ]

  useEffect(() => {
    const handleUpdate = () => {
      const { state } = editor
      const { from } = state.selection
      const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n')
      
      // Check if user typed /
      const match = textBefore.match(/\/(\w*)$/)
      
      if (match) {
        const query = match[1].toLowerCase()
        const filtered = availableCommands.filter(cmd => 
          cmd.title.toLowerCase().includes(`/${query}`)
        )
        
        if (filtered.length > 0) {
          setCommands(filtered)
          setIsOpen(true)
          setSelectedIndex(0)
        } else {
          setIsOpen(false)
        }
      } else {
        setIsOpen(false)
      }
    }

    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleUpdate)
    }
  }, [editor])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % commands.length)
        return true
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length)
        return true
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        const command = commands[selectedIndex]
        if (command) {
          // Remove the slash command text
          const { state } = editor
          const { from } = state.selection
          const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n')
          const match = textBefore.match(/\/(\w*)$/)
          if (match) {
            const startPos = from - match[0].length
            editor.chain().deleteRange({ from: startPos, to: from }).run()
          }
          command.command()
          setIsOpen(false)
        }
        return true
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        return true
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, commands, selectedIndex, editor])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
      style={{
        bottom: '100%',
        left: 0,
        marginBottom: '8px',
        minWidth: '300px',
      }}
    >
      {commands.map((command, index) => (
        <button
          key={command.title}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`}
          onClick={() => {
            const { state } = editor
            const { from } = state.selection
            const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, '\n')
            const match = textBefore.match(/\/(\w*)$/)
            if (match) {
              const startPos = from - match[0].length
              editor.chain().deleteRange({ from: startPos, to: from }).run()
            }
            command.command()
            setIsOpen(false)
          }}
        >
          <div className="font-semibold text-gray-900">{command.title}</div>
          <div className="text-sm text-gray-500">{command.description}</div>
        </button>
      ))}
    </div>
  )
}
