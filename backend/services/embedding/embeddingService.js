import { GoogleGenerativeAI } from '@google/generative-ai'
import { getVectorDB } from '#services/vectorDB/vectorDBFactory'
import MarkdownChunker from '#services/embedding/markdownChunker'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

class EmbeddingService {
  /**
   * Generate embedding for a text using Gemini text-embedding model
   * @param {string} text - The text to embed
   * @returns {Promise<Array<number>>} 768-dimensional embedding vector
   */
  async generateEmbedding(text) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

      const result = await model.embedContent(text)
      const embedding = result.embedding

      return embedding.values
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error('Failed to generate embedding: ' + error.message)
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param {Array<string>} texts - Array of texts to embed
   * @returns {Promise<Array<Array<number>>>} Array of embedding vectors
   */
  async generateEmbeddings(texts) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

      const results = await Promise.all(
        texts.map(text => model.embedContent(text))
      )

      return results.map(result => result.embedding.values)
    } catch (error) {
      console.error('Error generating embeddings:', error)
      throw new Error('Failed to generate embeddings: ' + error.message)
    }
  }

  /**
   * Embed a summary note and store in ChromaDB with heading-based chunking
   * @param {Object} summaryNote - Summary note object with id, title, content, markdown_content
   * @returns {Promise<void>}
   */
  async embedSummaryNote(summaryNote) {
    try {
      const vectorDB = getVectorDB()

      // First, delete any existing chunks for this note (to handle updates)
      await this.deleteSummaryNoteEmbedding(summaryNote.id)

      // Chunk the markdown content by headings
      const chunks = MarkdownChunker.chunkByHeadings(
        summaryNote.title,
        summaryNote.markdown_content || summaryNote.content
      )

      console.log(`📄 Chunking summary note ${summaryNote.id}: "${summaryNote.title}" into ${chunks.length} chunks`)

      // Prepare texts for embedding (with context)
      const textsToEmbed = chunks.map(chunk =>
        MarkdownChunker.createEmbeddingText(chunk)
      )

      // Generate embeddings for all chunks in parallel
      const embeddings = await this.generateEmbeddings(textsToEmbed)

      // Prepare documents for ChromaDB
      const documents = chunks.map((chunk, index) => ({
        id: `${summaryNote.id}-${index}`,  // Unique ID per chunk
        embedding: embeddings[index],
        content: chunk.content,
        metadata: {
          note_id: summaryNote.id,
          chunk_index: index,
          total_chunks: chunks.length,
          title: summaryNote.title,
          section_heading: chunk.heading,
          heading_level: chunk.level,
          parent_heading: chunk.parent || '',
          description: summaryNote.description || '',
          created_at: summaryNote.created_at ? summaryNote.created_at.toISOString() : new Date().toISOString(),
          type: 'summary_note_chunk'
        }
      }))

      // Store all chunks in ChromaDB
      await vectorDB.addDocuments('summary_notes', documents)
      console.log(`✓ Created ${chunks.length} embeddings for summary note: ${summaryNote.id}`)
    } catch (error) {
      console.error('Error embedding summary note:', error)
      throw new Error('Failed to embed summary note: ' + error.message)
    }
  }

  /**
   * Embed multiple summary notes in batch
   * @param {Array<Object>} summaryNotes - Array of summary note objects
   * @returns {Promise<void>}
   */
  async embedSummaryNotes(summaryNotes) {
    try {
      const vectorDB = getVectorDB()

      // Prepare texts for embedding
      const texts = summaryNotes.map(note =>
        `${note.title}\n\n${note.markdown_content || note.content}`
      )

      // Generate embeddings
      console.log(`Generating embeddings for ${summaryNotes.length} summary notes...`)
      const embeddings = await this.generateEmbeddings(texts)

      // Prepare documents
      const documents = summaryNotes.map((note, index) => ({
        id: note.id,
        embedding: embeddings[index],
        content: note.markdown_content || note.content,
        metadata: {
          title: note.title,
          description: note.description || '',
          note_id: note.id,
          created_at: note.created_at ? note.created_at.toISOString() : new Date().toISOString(),
          type: 'summary_note'
        }
      }))

      // Store in ChromaDB
      await vectorDB.addDocuments('summary_notes', documents)
      console.log(`✓ Created embeddings for ${summaryNotes.length} summary notes`)
    } catch (error) {
      console.error('Error embedding summary notes:', error)
      throw new Error('Failed to embed summary notes: ' + error.message)
    }
  }

  /**
   * Delete all chunks for a summary note from ChromaDB
   * @param {number} summaryNoteId - ID of the summary note to delete
   * @returns {Promise<void>}
   */
  async deleteSummaryNoteEmbedding(summaryNoteId) {
    try {
      const vectorDB = getVectorDB()

      // Delete all chunks for this note using metadata filter
      await vectorDB.deleteDocumentsByMetadata('summary_notes', {
        note_id: parseInt(summaryNoteId)
      })

      console.log(`✓ Deleted all embeddings for summary note: ${summaryNoteId}`)
    } catch (error) {
      console.error('Error deleting summary note embedding:', error)
      // Don't throw - allow silent failure for deletion
    }
  }

  /**
   * Count total embeddings in summary_notes collection
   * @returns {Promise<number>} Total count of embeddings
   */
  async countSummaryNoteEmbeddings() {
    try {
      const vectorDB = getVectorDB()
      const count = await vectorDB.countDocuments('summary_notes')
      return count
    } catch (error) {
      console.error('Error counting summary note embeddings:', error)
      return 0
    }
  }
}

export default new EmbeddingService()
