import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

export const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const Badge = styled.span`
  background: #06b6d4;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
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

export const Content = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
`

export const EmbeddingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const EmbeddingCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  background: white;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #06b6d4;
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
`

export const CardMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const MetaValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
`

export const ContentPreview = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0.75rem 0 0 0;
  line-height: 1.6;
  max-height: 3.6em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`

export const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`

export const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
`

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`

export const Footer = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PaginationInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

export const PaginationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.disabled ? '#f3f4f6' : '#06b6d4'};
  color: ${props => props.disabled ? '#9ca3af' : 'white'};
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #0891b2;
  }
`
