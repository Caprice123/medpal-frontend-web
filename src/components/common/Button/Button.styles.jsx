import styled from 'styled-components'

export const StyledButton = styled.button`
  padding: ${props => props.size === 'small' ? '0.5rem 0.875rem' :
                      props.size === 'large' ? '0.875rem 1.75rem' :
                      '0.625rem 1.25rem'};
  min-height: ${props => props.size === 'small' ? '36px' : '44px'};
  border-radius: 8px;
  font-weight: 600;
  font-size: ${props => props.size === 'small' ? '0.75rem' : '0.875rem'};
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.3s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(107, 185, 232, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(141, 198, 63, 0.5);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(107, 185, 232, 0.3);
    }
  ` : props.variant === 'danger' ? `
    background: #ef4444;
    color: white;

    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      background: #b91c1c;
      transform: translateY(0);
    }
  ` : props.variant === 'success' ? `
    background: #8DC63F;
    color: white;

    &:hover:not(:disabled) {
      background: #6BA32E;
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      background: #5A8625;
      transform: translateY(0);
    }
  ` : props.variant === 'outline' ? `
    background: transparent;
    color: #6BB9E8;
    border: 2px solid #6BB9E8;

    &:hover:not(:disabled) {
      background: #6BB9E8;
      color: white;
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      background: #4A9ED4;
      color: white;
      transform: translateY(0);
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }

    &:active:not(:disabled) {
      background: #f3f4f6;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props =>
      props.variant === 'primary' ? 'rgba(107, 185, 232, 0.15)' :
      props.variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' :
      props.variant === 'success' ? 'rgba(141, 198, 63, 0.15)' :
      'rgba(107, 185, 232, 0.15)'
    };
  }

  ${props => props.fullWidth && `
    width: 100%;
    justify-content: center;
  `}

  @media (max-width: 768px) {
    font-size: ${props => props.size === 'small' ? '0.8125rem' : '0.9375rem'};

    ${props => props.fullWidth && `
      width: 100%;
    `}
  }
`
