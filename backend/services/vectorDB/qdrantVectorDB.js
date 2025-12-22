// import { QdrantClient } from '@qdrant/js-client-rest'
import { BaseVectorDB } from './baseVectorDB.js'

/**
 * Qdrant Implementation
 *
 * Production-grade vector database with advanced features.
 * Requires Docker or Qdrant server running.
 *
 * To use: Set VECTOR_DB=qdrant in environment variables
 */
export class QdrantVectorDB extends BaseVectorDB {
  constructor(config = {}) {
    super()
    this.host = config.host || process.env.QDRANT_HOST || 'localhost'
    this.port = config.port || process.env.QDRANT_PORT || 6333
    this.apiKey = config.apiKey || process.env.QDRANT_API_KEY
    this.client = null
  }

  async initialize() {
    try {
      this.client = new QdrantClient({
        url: `http://${this.host}:${this.port}`,
        apiKey: this.apiKey
      })

      // Test connection
      await this.client.getCollections()
      console.log(`✓ Qdrant initialized at ${this.host}:${this.port}`)
    } catch (error) {
      console.error('Failed to initialize Qdrant:', error)
      throw error
    }
  }

  async createCollection(collectionName, config = {}) {
    try {
      const dimension = config.dimension || 768
      const distance = config.distance || 'Cosine'

      // Map distance metric to Qdrant format
      const distanceMap = {
        cosine: 'Cosine',
        euclidean: 'Euclid',
        dot: 'Dot'
      }

      await this.client.createCollection(collectionName, {
        vectors: {
          size: dimension,
          distance: distanceMap[distance.toLowerCase()] || 'Cosine'
        }
      })

      console.log(`✓ Qdrant collection created: ${collectionName}`)
    } catch (error) {
      // Collection might already exist
      if (!error.message?.includes('already exists')) {
        throw error
      }
    }
  }

  async collectionExists(collectionName) {
    try {
      await this.client.getCollection(collectionName)
      return true
    } catch (error) {
      return false
    }
  }

  async addDocuments(collectionName, documents) {
    try {
      const points = documents.map(doc => ({
        id: String(doc.id),
        vector: doc.embedding,
        payload: {
          ...doc.metadata,
          content: doc.content || ''
        }
      }))

      await this.client.upsert(collectionName, {
        wait: true,
        points
      })

      console.log(`✓ Added ${documents.length} documents to ${collectionName}`)
    } catch (error) {
      console.error('Failed to add documents to Qdrant:', error)
      throw error
    }
  }

  async updateDocument(collectionName, documentId, embedding, metadata, content) {
    try {
      await this.client.upsert(collectionName, {
        wait: true,
        points: [{
          id: String(documentId),
          vector: embedding,
          payload: {
            ...metadata,
            content
          }
        }]
      })

      console.log(`✓ Updated document ${documentId} in ${collectionName}`)
    } catch (error) {
      console.error('Failed to update document in Qdrant:', error)
      throw error
    }
  }

  async deleteDocument(collectionName, documentId) {
    try {
      await this.client.delete(collectionName, {
        wait: true,
        points: [String(documentId)]
      })

      console.log(`✓ Deleted document ${documentId} from ${collectionName}`)
    } catch (error) {
      console.error('Failed to delete document from Qdrant:', error)
      throw error
    }
  }

  async search(collectionName, queryEmbedding, options = {}) {
    try {
      const limit = options.limit || 5
      const threshold = options.threshold || 0

      // Build Qdrant filter
      let filter = null
      if (options.filter) {
        filter = this._buildQdrantFilter(options.filter)
      }

      const results = await this.client.search(collectionName, {
        vector: queryEmbedding,
        limit,
        filter,
        score_threshold: threshold,
        with_payload: true
      })

      // Transform results to standard format
      return results.map(result => ({
        id: result.id,
        score: result.score,
        metadata: result.payload,
        content: result.payload.content
      }))
    } catch (error) {
      console.error('Failed to search in Qdrant:', error)
      throw error
    }
  }

  _buildQdrantFilter(filter) {
    /**
     * Convert simple filter to Qdrant filter format
     * Example input: { semester: 4, university: 'UI' }
     * Example output: { must: [{ key: 'semester', match: { value: 4 } }, ...] }
     */
    const must = []

    for (const [key, value] of Object.entries(filter)) {
      if (key === 'content') continue // Skip content field

      must.push({
        key,
        match: { value }
      })
    }

    return must.length > 0 ? { must } : null
  }

  async getDocument(collectionName, documentId) {
    try {
      const results = await this.client.retrieve(collectionName, {
        ids: [String(documentId)],
        with_payload: true
      })

      if (results.length === 0) {
        return null
      }

      return {
        id: results[0].id,
        metadata: results[0].payload,
        content: results[0].payload.content
      }
    } catch (error) {
      console.error('Failed to get document from Qdrant:', error)
      return null
    }
  }

  async countDocuments(collectionName) {
    try {
      const info = await this.client.getCollection(collectionName)
      return info.points_count || 0
    } catch (error) {
      console.error('Failed to count documents in Qdrant:', error)
      return 0
    }
  }

  async deleteCollection(collectionName) {
    try {
      await this.client.deleteCollection(collectionName)
      console.log(`✓ Deleted collection: ${collectionName}`)
    } catch (error) {
      console.error('Failed to delete collection from Qdrant:', error)
      throw error
    }
  }

  async close() {
    // Qdrant client doesn't need explicit closing
    console.log('✓ Qdrant connection closed')
  }
}
