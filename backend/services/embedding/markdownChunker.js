/**
 * Markdown Chunking Service
 * Splits markdown content into semantic chunks based on headings (H1, H2)
 * Optimized for medical/educational content
 */

class MarkdownChunker {
  /**
   * Parse markdown and create chunks based on headings
   * @param {string} title - Document title
   * @param {string} markdownContent - Markdown content to chunk
   * @param {Object} options - Chunking options
   * @returns {Array<Object>} Array of chunks with metadata
   */
  static chunkByHeadings(title, markdownContent, options = {}) {
    const {
      minChunkSize = 100,    // Minimum characters per chunk
      maxChunkSize = 2000,   // Maximum characters per chunk
      splitLevel = 2         // Split at H1 and H2 by default
    } = options

    if (!markdownContent) {
      return [{
        heading: title,
        content: '',
        level: 0,
        index: 0,
        parent: null
      }]
    }

    const chunks = []
    const lines = markdownContent.split('\n')

    let currentH1 = title
    let currentH2 = null
    let currentChunk = {
      heading: title,
      content: '',
      level: 0,
      index: 0,
      parent: null
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Detect H1 heading
      if (line.match(/^#\s+(.+)$/)) {
        // Save previous chunk if it has content
        if (currentChunk.content.trim().length >= minChunkSize) {
          chunks.push({ ...currentChunk })
        }

        // Start new H1 chunk
        currentH1 = line.replace(/^#\s+/, '').trim()
        currentH2 = null
        currentChunk = {
          heading: currentH1,
          content: '',
          level: 1,
          index: chunks.length,
          parent: null
        }
        continue
      }

      // Detect H2 heading
      if (line.match(/^##\s+(.+)$/) && splitLevel >= 2) {
        // Save previous chunk if it has content
        if (currentChunk.content.trim().length >= minChunkSize) {
          chunks.push({ ...currentChunk })
        }

        // Start new H2 chunk
        currentH2 = line.replace(/^##\s+/, '').trim()
        currentChunk = {
          heading: currentH2,
          content: '',
          level: 2,
          index: chunks.length,
          parent: currentH1
        }
        continue
      }

      // Add line to current chunk
      currentChunk.content += line + '\n'

      // Check if chunk is getting too large
      if (currentChunk.content.length > maxChunkSize) {
        // Try to split at paragraph boundary
        const paragraphs = currentChunk.content.split('\n\n')
        if (paragraphs.length > 1) {
          // Keep last paragraph for next chunk
          const lastParagraph = paragraphs.pop()
          currentChunk.content = paragraphs.join('\n\n')

          // Save current chunk
          chunks.push({ ...currentChunk })

          // Start new chunk with same heading
          currentChunk = {
            ...currentChunk,
            content: lastParagraph,
            index: chunks.length
          }
        }
      }
    }

    // Save final chunk if it has content
    if (currentChunk.content.trim().length >= minChunkSize) {
      chunks.push({ ...currentChunk })
    }

    // If no chunks were created (document too small), create one chunk with all content
    if (chunks.length === 0) {
      chunks.push({
        heading: title,
        content: markdownContent,
        level: 0,
        index: 0,
        parent: null
      })
    }

    return chunks
  }

  /**
   * Create embedding text from chunk
   * Combines heading hierarchy with content for better context
   */
  static createEmbeddingText(chunk) {
    const parts = []

    // Add parent heading for context (if exists)
    if (chunk.parent) {
      parts.push(chunk.parent)
    }

    // Add current heading
    parts.push(chunk.heading)

    // Add content
    parts.push(chunk.content.trim())

    return parts.join('\n\n')
  }

  /**
   * Format chunk for display/preview
   */
  static formatChunkPreview(chunk, maxLength = 200) {
    const preview = chunk.content.trim()
    if (preview.length <= maxLength) {
      return preview
    }
    return preview.substring(0, maxLength) + '...'
  }
}

export default MarkdownChunker
