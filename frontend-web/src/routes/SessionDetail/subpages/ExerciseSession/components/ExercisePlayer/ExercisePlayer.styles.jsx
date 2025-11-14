import styled from "styled-components"

export const Container = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
`

export const HeaderNav = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const BackLink = styled.button`
  background: transparent;
  border: none;
  color: #0891b2;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #0e7490;
  }
`

export const TopicTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
`

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`

export const Progress = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`

export const QuestionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`

export const QuestionNumber = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

export const QuestionText = styled.div`
  font-size: 1.25rem;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`

export const BlankInput = styled.input`
  display: inline-block;
  min-width: 120px;
  padding: 0.25rem 0.75rem;
  border: none;
  border-bottom: 2px solid #0891b2;
  background: transparent;
  color: #0891b2;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0 0.25rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-bottom-color: #0e7490;
    background: rgba(8, 145, 178, 0.05);
  }

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
`

export const Button = styled.button`
  background: ${props => {
    if (props.disabled) return '#d1d5db'
    if (props.variant === 'primary') return 'linear-gradient(135deg, #0e7490, #14b8a6)'
    if (props.variant === 'secondary') return '#6b7280'
    return '#e5e7eb'
  }};
  color: ${props => props.variant === 'outline' ? '#6b7280' : 'white'};
  border: ${props => props.variant === 'outline' ? '2px solid #e5e7eb' : 'none'};
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.3);
  }
`

export const QuestionIndicators = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`

export const QuestionDot = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid ${props => props.answered ? '#14b8a6' : '#e5e7eb'};
  background: ${props => {
    if (props.current) return 'linear-gradient(135deg, #0e7490, #14b8a6)'
    if (props.answered) return '#d1fae5'
    return 'white'
  }};
  color: ${props => props.current ? 'white' : props.answered ? '#14b8a6' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.2);
  }
`

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const QuestionStats = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 1rem;
`