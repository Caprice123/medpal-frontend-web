import styled from 'styled-components'

export const Container = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const Header = styled.div`
  max-width: 1280px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
`

export const DeckSelectionContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

export const DeckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

export const DeckCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(6, 182, 212, 0.15);
    border-color: #06b6d4;
  }
`

export const DeckHeader = styled.div`
  flex: 1;
`

export const DeckTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const Tag = styled.span`
  background: ${props => props.type === 'status' ? 'rgba(6, 182, 212, 0.1)' : props.type === 'score' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  color: ${props => props.type === 'status' ? '#06b6d4' : props.type === 'score' ? '#06b6d4' : '#374151'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

export const DeckFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const CardCount = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
`

export const CostBadge = styled.div`
  color: #06b6d4;
  font-weight: 600;
  margin-top: 0.25rem;
`

export const StartButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
