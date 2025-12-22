import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

export const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
`

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

export const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const UserText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6b7280;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`

export const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
`

export const MessageContent = styled.div`
  background: ${props => props.isUser ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : '#111827'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 75%;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  font-size: 0.875rem;

  ${props => props.isUser && `
    border-bottom-right-radius: 4px;
  `}

  ${props => !props.isUser && `
    border-bottom-left-radius: 4px;
  `}
`

export const MessageMeta = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const ModeBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: ${props => {
    if (props.mode === 'normal') return '#dbeafe'
    if (props.mode === 'validated') return '#fef3c7'
    if (props.mode === 'research') return '#fce7f3'
    return '#f3f4f6'
  }};
  color: ${props => {
    if (props.mode === 'normal') return '#1e40af'
    if (props.mode === 'validated') return '#92400e'
    if (props.mode === 'research') return '#831843'
    return '#6b7280'
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
`

export const SourcesSection = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'};
  border-radius: 8px;
  max-width: 75%;
`

export const SourcesTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.isUser ? 'white' : '#374151'};
`

export const SourceItem = styled.div`
  font-size: 0.75rem;
  padding: 0.5rem;
  background: ${props => props.isUser ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  color: ${props => props.isUser ? 'white' : '#6b7280'};

  &:last-child {
    margin-bottom: 0;
  }
`

export const SourceTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${props => props.isUser ? 'white' : '#111827'};
`

export const SourceUrl = styled.a`
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.8)' : '#3b82f6'};
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`
