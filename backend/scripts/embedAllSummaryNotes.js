/**
 * Script to embed all summary notes into ChromaDB
 * - Converts BlockNote content to markdown if markdown_content is empty
 * - Embeds all published summary notes
 * - Updates markdown_content in database
 */

import prisma from '#prisma/client.js'
import embeddingService from '#services/embedding/embeddingService.js'
import { initializeVectorDB } from '#services/vectorDB/vectorDBFactory.js'

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


/**
 * Convert BlockNote JSON content to markdown using official BlockNote API
 */
function blockNoteToMarkdown(content) {
  try {
    // Parse content if it's a string
    const blocks = typeof content === 'string' ? JSON.parse(content) : content

    if (!Array.isArray(blocks)) {
      console.warn('Content is not an array of blocks')
      return ''
    }

    // Use BlockNote's official markdown converter
    const markdown = blocksToMarkdown(blocks)
    return markdown.trim()
  } catch (error) {
    console.error('Error converting BlockNote to markdown:', error)
    return ''
  }
}

/**
 * Main function to embed all summary notes
 */
async function embedAllSummaryNotes() {
  console.log('🚀 Starting summary notes embedding process...\n')

  try {
    // Initialize ChromaDB
    console.log('📦 Initializing ChromaDB...')
    await initializeVectorDB()
    console.log('✓ ChromaDB initialized\n')

    // Get all published summary notes
    const summaryNotes = await prisma.summary_notes.findMany({
      where: {
        status: 'published',
        is_active: true
      },
      orderBy: { id: 'asc' }
    })

    console.log(`📚 Found ${summaryNotes.length} published summary notes\n`)

    if (summaryNotes.length === 0) {
      console.log('ℹ️  No published summary notes found. Exiting.')
      return
    }

    let converted = 0
    let embedded = 0
    let errors = 0

    for (const note of summaryNotes) {
      console.log(`\n📄 Processing: "${note.title}" (ID: ${note.id})`)

      let markdownContent = note.markdown_content

      // Convert BlockNote to markdown if markdown_content is empty
      if (!markdownContent || markdownContent.trim() === '') {
        console.log('   ⚙️  Converting BlockNote content to markdown...')

        try {
          markdownContent = blockNoteToMarkdown(note.content)

          if (markdownContent) {
            // Update database with converted markdown
            await prisma.summary_notes.update({
              where: { id: note.id },
              data: { markdown_content: markdownContent }
            })

            converted++
            console.log('   ✓ Converted and saved markdown content')
          } else {
            console.warn('   ⚠️  Could not convert content to markdown (empty result)')
            // Use original content as fallback
            markdownContent = typeof note.content === 'string' ? note.content : JSON.stringify(note.content)
          }
        } catch (error) {
          console.error('   ✗ Error converting BlockNote to markdown:', error.message)
          // Use original content as fallback
          markdownContent = typeof note.content === 'string' ? note.content : JSON.stringify(note.content)
        }
      } else {
        console.log('   ✓ Markdown content already exists')
      }

      // Embed the note
      try {
        console.log('   🔄 Generating embeddings...')

        // Create complete note object for embedding service
        const noteToEmbed = {
          id: note.id,
          title: note.title,
          description: note.description,
          content: note.content,
          markdown_content: markdownContent,
          created_at: note.created_at
        }

        await embeddingService.embedSummaryNote(noteToEmbed)
        embedded++
        console.log('   ✓ Successfully embedded')
      } catch (error) {
        console.error('   ✗ Error embedding note:', error.message)
        errors++
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total notes processed:     ${summaryNotes.length}`)
    console.log(`Converted to markdown:     ${converted}`)
    console.log(`Successfully embedded:     ${embedded}`)
    console.log(`Errors:                    ${errors}`)
    console.log('='.repeat(60))

    if (embedded > 0) {
      console.log('\n✅ Embedding process completed successfully!')
      console.log('\n💡 Next steps:')
      console.log('   1. View embeddings in ChromaDB Admin: http://localhost:3001')
      console.log('   2. Or view in your app: Admin → Summary Notes → ChromaDB Viewer')
      console.log('   3. Test the chatbot in "validated" mode to see RAG in action')
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    console.log('\n👋 Database connection closed')
  }
}

// Run the script
embedAllSummaryNotes()
  .then(() => {
    console.log('\n✓ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error)
    process.exit(1)
  })
