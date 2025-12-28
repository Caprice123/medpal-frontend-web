import styled from 'styled-components'

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`

export const Header = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

export const TopicInfo = styled.div`
  margin-top: 0.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #06b6d4;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: #374151;
  }
`


export const QuestionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`

export const QuestionNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 1rem;
`

export const QuestionText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

export const InlineInput = styled.input`
  display: inline-block;
  min-width: 200px;
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  border: none;
  border-bottom: 2px solid #06b6d4;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 600;
  font-family: inherit;
  color: #06b6d4;
  text-align: center;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-bottom: 2px solid #0891b2;
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`
