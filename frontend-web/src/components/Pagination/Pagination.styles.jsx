import styled from 'styled-components'

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.$variant === 'admin' ? '6px' : '0.375rem'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  /* Default variant (cyan background) */
  ${props => props.$variant !== 'admin' && `
    background-color: ${props.disabled ? '#e5e7eb' : '#0891b2'};
    color: ${props.disabled ? '#9ca3af' : 'white'};
    border: none;

    &:hover:not(:disabled) {
      background-color: #0e7490;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `}

  /* Admin variant (white background with cyan border) */
  ${props => props.$variant === 'admin' && `
    background: white;
    color: #6BB9E8;
    border: 1px solid #6BB9E8;

    &:hover:not(:disabled) {
      background: #6BB9E8;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`

export const PageInfo = styled.div`
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
  min-width: 100px;
  text-align: center;
`
