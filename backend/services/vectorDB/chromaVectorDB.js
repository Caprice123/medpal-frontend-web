import { ChromaClient } from 'chromadb'
import { BaseVectorDB } from './baseVectorDB.js'

/**
 * ChromaDB Client-Server Implementation
 *
 * Connects to local ChromaDB server via HTTP.
 * ChromaDB server runs locally with persistent storage (like PostgreSQL).
 * Data is stored in ./data/chromadb directory.
 *
 * To start the server: npm run chromadb:start
 */
export class ChromaVectorDB extends BaseVectorDB {
  constructor(config = {}) {
    super()
    this.host = config.host || process.env.CHROMA_HOST || 'localhost'
    this.port = config.port || process.env.CHROMA_PORT || 8000
    this.client = null
  }

  async initialize() {
    try {
      // Connect to ChromaDB server via HTTP
      this.client = new ChromaClient({
        path: `http://${this.host}:${this.port}`
      })

      // Test connection
      await this.client.heartbeat()
      console.log(`✓ ChromaDB connected at http://${this.host}:${this.port}`)
    } catch (error) {
      console.error('Failed to connect to ChromaDB server:', error)
      console.error('Start the server with: npm run chromadb:start')
      throw error
    }
  }

  async createCollection(collectionName, config = {}) {
    try {
      const collection = await this.client.createCollection({
        name: collectionName,
        metadata: {
          dimension: config.dimension || 768,
          distance: config.distance || 'cosine'
        }
      })
      console.log(`✓ ChromaDB collection created: ${collectionName}`)
      return collection
    } catch (error) {
      // Collection might already exist
      if (error.message?.includes('already exists')) {
        return await this.client.getCollection({ name: collectionName })
      }
      throw error
    }
  }

  async collectionExists(collectionName) {
    try {
      await this.client.getCollection({ name: collectionName })
      return true
    } catch (error) {
      return false
    }
  }

  async addDocuments(collectionName, documents) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const ids = documents.map(doc => String(doc.id))
      const embeddings = documents.map(doc => doc.embedding)
      const metadatas = documents.map(doc => doc.metadata || {})
      const contents = documents.map(doc => doc.content || '')

      await collection.add({
        ids,
        embeddings,
        metadatas,
        documents: contents
      })

      console.log(`✓ Added ${documents.length} documents to ${collectionName}`)
    } catch (error) {
      console.error('Failed to add documents to ChromaDB:', error)
      throw error
    }
  }

  async updateDocument(collectionName, documentId, embedding, metadata, content) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      await collection.update({
        ids: [String(documentId)],
        embeddings: [embedding],
        metadatas: [metadata],
        documents: [content]
      })

      console.log(`✓ Updated document ${documentId} in ${collectionName}`)
    } catch (error) {
      console.error('Failed to update document in ChromaDB:', error)
      throw error
    }
  }

  async deleteDocument(collectionName, documentId) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      await collection.delete({
        ids: [String(documentId)]
      })

      console.log(`✓ Deleted document ${documentId} from ${collectionName}`)
    } catch (error) {
      console.error('Failed to delete document from ChromaDB:', error)
      throw error
    }
  }

  /**
   * Delete documents by metadata filter
   * @param {string} collectionName - Collection name
   * @param {Object} whereFilter - ChromaDB where filter
   */
  async deleteDocumentsByMetadata(collectionName, whereFilter) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      await collection.delete({
        where: whereFilter
      })

      console.log(`✓ Deleted documents from ${collectionName} matching filter:`, whereFilter)
    } catch (error) {
      console.error('Failed to delete documents from ChromaDB:', error)
      throw error
    }
  }

  /**
   * Get all documents from a collection
   * @param {string} collectionName - Collection name
   * @returns {Array} All documents in the collection
   */
  async getAllDocuments(collectionName) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const result = await collection.get()

      if (!result.ids || result.ids.length === 0) {
        return []
      }

      // Format documents
      const documents = []
      for (let i = 0; i < result.ids.length; i++) {
        documents.push({
          id: result.ids[i],
          metadata: result.metadatas[i],
          content: result.documents[i],
          embedding: result.embeddings?.[i] || null
        })
      }

      return documents
    } catch (error) {
      console.error('Failed to get all documents from ChromaDB:', error)
      return []
    }
  }

  async search(collectionName, queryEmbedding, options = {}) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const limit = options.limit || 5
      const filter = options.filter || null

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: limit,
        where: filter // ChromaDB filter format
      })

      // Transform results to standard format
      const formattedResults = []
      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const score = results.distances[0][i]

          // Apply threshold filter if specified
          if (options.threshold && score < options.threshold) {
            continue
          }

          formattedResults.push({
            id: results.ids[0][i],
            score: 1 - score, // Convert distance to similarity (0-1)
            metadata: results.metadatas[0][i],
            content: results.documents[0][i]
          })
        }
      }

      return formattedResults
    } catch (error) {
      console.error('Failed to search in ChromaDB:', error)
      throw error
    }
  }

  async getDocument(collectionName, documentId) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })

      const result = await collection.get({
        ids: [String(documentId)]
      })

      if (!result.ids || result.ids.length === 0) {
        return null
      }

      return {
        id: result.ids[0],
        metadata: result.metadatas[0],
        content: result.documents[0]
      }
    } catch (error) {
      console.error('Failed to get document from ChromaDB:', error)
      return null
    }
  }

  async countDocuments(collectionName) {
    try {
      const collection = await this.client.getCollection({ name: collectionName })
      const count = await collection.count()
      return count
    } catch (error) {
      console.error('Failed to count documents in ChromaDB:', error)
      return 0
    }
  }

  async deleteCollection(collectionName) {
    try {
      await this.client.deleteCollection({ name: collectionName })
      console.log(`✓ Deleted collection: ${collectionName}`)
    } catch (error) {
      console.error('Failed to delete collection from ChromaDB:', error)
      throw error
    }
  }

  async close() {
    // ChromaDB client doesn't need explicit closing
    console.log('✓ ChromaDB connection closed')
  }
}
