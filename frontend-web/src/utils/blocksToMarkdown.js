import { BlockNoteEditor } from "@blocknote/core"

/**
 * Convert BlockNote blocks to Markdown format
 * @param {Array} blocks - BlockNote blocks array
 * @returns {string} - Markdown string
 */
export function blocksToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return ''
  }

  try {
    // Use BlockNote's built-in method to convert blocks to markdown
    const editor = BlockNoteEditor.create()
    const markdown = editor.blocksToMarkdownLossy(blocks)
    editor.destroy() // Clean up
    return markdown
  } catch (error) {
    console.error('Failed to convert blocks to markdown:', error)
    // Fallback to empty string
    return ''
  }
}
