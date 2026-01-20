import styled from 'styled-components'

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${props => props.variant === 'primary' ? '#eff6ff' :
               props.variant === 'success' ? '#ecfdf5' :
               props.variant === 'warning' ? '#fffbeb' :
               props.variant === 'danger' ? '#fef2f2' :
               'white'};
  border: 1px solid ${props => props.variant === 'primary' ? '#93c5fd' :
                      props.variant === 'success' ? '#86efac' :
                      props.variant === 'warning' ? '#fcd34d' :
                      props.variant === 'danger' ? '#fca5a5' :
                      '#e5e7eb'};
  border-radius: ${props => props.rounded === 'sm' ? '4px' :
                   props.rounded === 'lg' ? '12px' :
                   '8px'};
  overflow: hidden;
  transition: all 0.2s;
  box-shadow: ${props => props.shadow ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none'};
  height: 100%;

  ${props => props.hoverable && `
    &:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }
  `}

  ${props => props.clickable && `
    cursor: pointer;
  `}
`

export const CardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.padding || '1rem 1.5rem'};
  border-bottom: ${props => props.divider ? '1px solid #e5e7eb' : 'none'};
  background: ${props => props.background || 'transparent'};
  gap: 1rem;
`

export const CardTitle = styled.div`
  font-weight: 600;
  font-size: ${props => props.size === 'sm' ? '0.875rem' :
               props.size === 'lg' ? '1.125rem' :
               '1rem'};
  color: ${props => props.color || '#111827'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CardBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${props => props.padding || '1.5rem'};
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
`

export const CardFooterContainer = styled.div`
  display: flex;
  justify-content: ${props => props.align === 'left' ? 'flex-start' :
                     props.align === 'center' ? 'center' :
                     props.align === 'between' ? 'space-between' :
                     'flex-end'};
  align-items: center;
  gap: 0.75rem;
  padding: ${props => props.padding || '1rem 1.5rem'};
  border-top: ${props => props.divider ? '1px solid #e5e7eb' : 'none'};
  background: ${props => props.background || 'transparent'};
`
