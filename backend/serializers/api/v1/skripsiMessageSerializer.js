export class SkripsiMessageSerializer {
  static serialize(messages) {
    return messages.map(msg => {
      console.log('📝 Original message:', {
        id: msg.id,
        sender_type: msg.sender_type,
        senderType: msg.senderType,
        created_at: msg.created_at,
        createdAt: msg.createdAt
      })

      const serialized = {
        id: msg.id,
        senderType: msg.sender_type || msg.senderType,
        content: msg.content,
        createdAt: msg.created_at || msg.createdAt
      }

      console.log('✅ Serialized message:', serialized)
      return serialized
    })
  }
}
