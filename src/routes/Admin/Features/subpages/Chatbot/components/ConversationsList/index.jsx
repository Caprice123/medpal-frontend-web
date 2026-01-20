import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ConversationsGrid,
  ConversationCard,
  ConversationHeader,
  ConversationTitle,
  UserInfo,
  UserName,
  UserEmail,
  ConversationStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  ViewButton,
  DeleteButton
} from './ConversationsList.styles'

function ConversationsList({ onView, onDelete }) {
  const { conversations, loading } = useSelector((state) => state.chatbot)

  // Loading state
  if (loading?.isConversationsLoading) {
    return <LoadingOverlay>Memuat percakapan...</LoadingOverlay>
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>💬</EmptyStateIcon>
        <EmptyStateText>Belum ada percakapan</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render conversations grid
  return (
    <ConversationsGrid>
      {conversations.map(conversation => (
        <ConversationCard key={conversation.id} onClick={() => onView(conversation)}>
          <ConversationHeader>
            <ConversationTitle>{conversation.topic || 'Untitled Conversation'}</ConversationTitle>
          </ConversationHeader>

          {/* User Info */}
          <UserInfo>
            <UserName>{conversation.user?.name || 'Unknown User'}</UserName>
            <UserEmail>{conversation.user?.email || 'No email'}</UserEmail>
          </UserInfo>

          <div style={{ flex: "1" }}></div>

          <ConversationStats>
            <StatItem>
              <StatLabel>Pesan</StatLabel>
              <StatValue>{conversation.messageCount || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Dibuat</StatLabel>
              <StatValue>
                {new Date(conversation.createdAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Diupdate</StatLabel>
              <StatValue>
                {new Date(conversation.updatedAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </ConversationStats>

          <CardActions>
            <ViewButton onClick={(e) => {
              e.stopPropagation()
              onView(conversation)
            }}>
              Lihat Pesan
            </ViewButton>
            <DeleteButton onClick={(e) => {
              e.stopPropagation()
              onDelete(conversation)
            }}>
              Hapus
            </DeleteButton>
          </CardActions>
        </ConversationCard>
      ))}
    </ConversationsGrid>
  )
}

export default ConversationsList
