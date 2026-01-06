import { BlockNoteEditor } from "@blocknote/core";

/**
 * Convert BlockNote blocks to HTML
 * @param {Array} blocks - BlockNote blocks array
 * @returns {Promise<string>} HTML string
 */
export async function blocksToHTML(blocks) {
  try {
    // Create a temporary editor instance for conversion
    const tempEditor = BlockNoteEditor.create();
    const html = await tempEditor.blocksToHTMLLossy(blocks);
    return html;
  } catch (error) {
    console.error('Failed to convert blocks to HTML:', error);
    throw error;
  }
}

/**
 * Convert HTML to BlockNote blocks
 * @param {string} html - HTML string
 * @returns {Promise<Array>} BlockNote blocks array
 */
export async function htmlToBlocks(html) {
  try {
    if (!html || html.trim() === '') {
      // Return default empty paragraph for empty content
      return [
        {
          type: "paragraph",
          content: "",
        },
      ];
    }

    // Create a temporary editor instance for conversion
    const tempEditor = BlockNoteEditor.create();
    const blocks = await tempEditor.tryParseHTMLToBlocks(html);
    return blocks;
  } catch (error) {
    console.error('Failed to convert HTML to blocks:', error);
    // Return default empty paragraph on error
    return [
      {
        type: "paragraph",
        content: "",
      },
    ];
  }
}
