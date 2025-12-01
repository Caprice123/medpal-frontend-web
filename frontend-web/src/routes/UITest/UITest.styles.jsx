import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

export const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const Section = styled.div`
  margin-bottom: 3rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`

export const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`

export const ComponentCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
`

export const ComponentLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`

export const ComponentDemo = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StateLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.5rem;

  ${props => props.variant === 'success' ? `
    background: #dcfce7;
    color: #16a34a;
  ` : props.variant === 'error' ? `
    background: #fee2e2;
    color: #dc2626;
  ` : props.variant === 'warning' ? `
    background: #fef3c7;
    color: #d97706;
  ` : `
    background: #e0e7ff;
    color: #4f46e5;
  `}
`

export const ColorPalette = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const ColorSwatch = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background: ${props => props.color};
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  color: ${props => props.light ? '#111827' : 'white'};
  font-weight: 600;
`
