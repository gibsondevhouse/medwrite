import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Markdown } from 'tiptap-markdown'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * Slash Commands Extension
 * Handles slash command menu (/h1, /h2, /img, etc.)
 */
export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommands'),
        props: {
          handleKeyDown(_view, event) {
            // Handle slash command detection
            if (event.key === '/') {
              // This will be handled by a React component overlay
              return false
            }
            return false
          },
        },
      }),
    ]
  },
})

/**
 * Image Drop Handler Extension
 * Handles drag-and-drop image upload with Base64 conversion
 */
export const ImageDropHandler = Extension.create({
  name: 'imageDropHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageDropHandler'),
        props: {
          handleDrop(view, event, _slice, moved) {
            if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
              event.preventDefault()
              
              const files = Array.from(event.dataTransfer.files)
              const imageFiles = files.filter(file => file.type.startsWith('image/'))

              imageFiles.forEach(file => {
                const reader = new FileReader()
                reader.onload = (e) => {
                  const base64 = e.target?.result as string
                  const { schema } = view.state
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                  
                  if (coordinates) {
                    const node = schema.nodes.image.create({ src: base64 })
                    const transaction = view.state.tr.insert(coordinates.pos, node)
                    view.dispatch(transaction)
                  }
                }
                reader.readAsDataURL(file)
              })
              
              return true
            }
            return false
          },
          handlePaste(view, event, _slice) {
            const items = Array.from(event.clipboardData?.items || [])
            const imageItems = items.filter(item => item.type.indexOf('image') !== -1)

            if (imageItems.length > 0) {
              event.preventDefault()
              
              imageItems.forEach(item => {
                const file = item.getAsFile()
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const base64 = e.target?.result as string
                    const { schema } = view.state
                    const { from } = view.state.selection
                    const node = schema.nodes.image.create({ src: base64 })
                    const transaction = view.state.tr.insert(from, node)
                    view.dispatch(transaction)
                  }
                  reader.readAsDataURL(file)
                }
              })
              
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})

/**
 * Export all extensions for the editor
 */
export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
  }),
  Placeholder.configure({
    placeholder: 'Start writing... Type / for commands',
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  Markdown.configure({
    html: false,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  SlashCommands,
  ImageDropHandler,
]
