import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

export const Header = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
`

export const SessionList = styled.div`
  display: grid;
  gap: 1.5rem;
`

export const SessionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

export const SessionInfo = styled.div`
  flex: 1;
`

export const SessionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
`

export const SessionDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`

export const ScoreBadge = styled.div`
  background: ${props => {
    if (props.percentage >= 80) return 'linear-gradient(135deg, #10b981, #059669)'
    if (props.percentage >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)'
    return 'linear-gradient(135deg, #ef4444, #dc2626)'
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  min-width: 80px;
  text-align: center;
`

export const SessionStats = styled.div`
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  span {
    font-weight: 600;
    color: #1f2937;
  }
`

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #d1fae5;
          color: #065f46;
        `
      case 'active':
        return `
          background: #dbeafe;
          color: #1e40af;
        `
      default:
        return `
          background: #f3f4f6;
          color: #6b7280;
        `
    }
  }}
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  div:first-child {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #6b7280;
  }
`

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #8b5cf6;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
