import styled from 'styled-components'

export const Container = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: transparent;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 0.625rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: #f3f4f6;
    border-color: #0891b2;
    color: #0891b2;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const IconLarge = styled.div`
  width: 70px;
  height: 70px;
  background: ${props => `${props.color}15`};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 2px solid ${props => `${props.color}30`};
`

export const TitleSection = styled.div`
  flex: 1;
`

export const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}dd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.25rem 0;
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`

export const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: ${props => props.isActive
    ? 'rgba(16, 185, 129, 0.1)'
    : 'rgba(239, 68, 68, 0.1)'};
  border: 2px solid ${props => props.isActive
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 12px;
`

export const ContentSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${props => props.color || '#0891b2'};
    border-radius: 2px;
  }
`

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.borderColor || '#0891b2'};
    box-shadow: 0 0 0 3px ${props => props.borderColor || '#0891b2'}15;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.borderColor || '#0891b2'};
    box-shadow: 0 0 0 3px ${props => props.borderColor || '#0891b2'}15;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #d1d5db;
    transition: 0.4s;
    border-radius: 28px;

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${props => props.color || '#0891b2'};
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`

export const SwitchLabel = styled.span`
  font-weight: 600;
  color: ${props => props.isActive ? props.color : '#6b7280'};
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, ${props.color}, ${props.color}dd);
    color: white;
    box-shadow: 0 4px 12px ${props.color}40;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px ${props.color}50;
    }
  ` : `
    background: transparent;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`

export const InfoBox = styled.div`
  background: ${props => `${props.color}10`};
  border: 2px solid ${props => `${props.color}30`};
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;

  svg {
    flex-shrink: 0;
    color: ${props => props.color};
  }
`

export const InfoText = styled.p`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
`
