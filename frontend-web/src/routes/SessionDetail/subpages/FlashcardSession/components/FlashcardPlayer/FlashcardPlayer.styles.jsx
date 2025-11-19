import styled from 'styled-components'

export const PlayerContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

export const ProgressBar = styled.div`
  margin-bottom: 30px;
`

export const ProgressText = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`

export const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #0891b2);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`

export const CardContainer = styled.div`
  perspective: 1000px;
  margin-bottom: 30px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Flashcard = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};

  @media (max-width: 768px) {
    height: 250px;
  }
`

export const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 30px;
  background: white;
`

export const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`

export const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
`

export const CardLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  opacity: 0.9;
`

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  p {
    font-size: 24px;
    line-height: 1.5;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`

export const AnswerSection = styled.div`
  margin-bottom: 20px;
`

export const AnswerLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`

export const AnswerInput = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #06b6d4;
  }
`

export const ShowAnswerSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

export const ShowAnswerButton = styled.button`
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`

export const NavigationButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 30px;
`

export const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`

export const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
  }
`

export const SecondaryButton = styled(Button)`
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #545b62;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
  }
`

export const CardDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
`

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.active) return '#06b6d4'
    if (props.completed) return '#28a745'
    return '#dee2e6'
  }};
  cursor: pointer;
  transition: all 0.3s;
  transform: ${props => props.active ? 'scale(1.3)' : 'scale(1)'};

  &:hover {
    background-color: ${props => props.active || props.completed ? null : '#adb5bd'};
    transform: scale(1.2);
  }
`
