import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 0.875rem;
  }
`

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PageButton = styled.button`
  min-width: 36px;
  min-height: 36px;
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  transition: all 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover:not(:disabled) {
    background: ${props => props.active
      ? 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)'
      : 'rgba(107, 185, 232, 0.08)'};
    border-color: ${props => props.active ? 'transparent' : '#6BB9E8'};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    min-width: 40px;
    min-height: 40px;
    font-size: 0.9375rem;
  }
`

export const PageEllipsis = styled.span`
  padding: 0.375rem 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`
