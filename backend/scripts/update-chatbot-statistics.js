import prisma from '../prisma/client.js'

/**
 * Script to update chatbot message count statistics
 * This counts messages for each mode and stores them as constants
 */
async function updateChatbotStatistics() {
  try {
    console.log('📊 Updating chatbot statistics...\n')

    // Count messages for each mode
    const normalCount = await prisma.chatbot_messages.count({
      where: {
        sender_type: 'ai',
        mode_type: 'normal',
        is_deleted: false
      }
    })

    const validatedCount = await prisma.chatbot_messages.count({
      where: {
        sender_type: 'ai',
        mode_type: 'validated',
        is_deleted: false
      }
    })

    const researchCount = await prisma.chatbot_messages.count({
      where: {
        sender_type: 'ai',
        mode_type: 'research',
        is_deleted: false
      }
    })

    console.log(`📈 Message counts:`)
    console.log(`   Normal Mode: ${normalCount}`)
    console.log(`   Validated Mode: ${validatedCount}`)
    console.log(`   Research Mode: ${researchCount}`)
    console.log()

    // Update or create constants for each mode
    const constantsToUpdate = [
      { key: 'chatbot_normal_message_count', value: String(normalCount) },
      { key: 'chatbot_validated_message_count', value: String(validatedCount) },
      { key: 'chatbot_research_message_count', value: String(researchCount) }
    ]

    for (const constant of constantsToUpdate) {
      await prisma.constants.upsert({
        where: { key: constant.key },
        update: { value: constant.value, updated_at: new Date() },
        create: { key: constant.key, value: constant.value }
      })
      console.log(`✅ Updated ${constant.key} = ${constant.value}`)
    }

    console.log('\n✨ Statistics updated successfully!')
  } catch (error) {
    console.error('❌ Error updating statistics:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
updateChatbotStatistics()
