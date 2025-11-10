import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: ${props => props.isActive
    ? 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)'
    : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'};
  border: 2px solid ${props => props.isActive ? props.borderColor || '#0891b2' : '#d1d5db'};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  opacity: ${props => props.isActive ? 1 : 0.6};
  filter: ${props => props.isActive ? 'none' : 'grayscale(0.5)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isActive
      ? `linear-gradient(90deg, ${props.borderColor}, ${props.borderColor})`
      : '#d1d5db'};
  }

  &:hover {
    transform: ${props => props.isActive ? 'translateY(-4px) scale(1.02)' : 'translateY(-2px)'};
    box-shadow: ${props => props.isActive
      ? `0 12px 24px ${props.borderColor}33`
      : '0 8px 16px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.isActive ? props.borderColor : '#9ca3af'};
  }
`

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => `${props.color}15`};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all 0.3s ease;
  border: 2px solid ${props => `${props.color}30`};

  ${Card}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: ${props => `${props.color}25`};
  }
`

export const StatusBadge = styled.div`
  background: ${props => props.isActive
    ? 'linear-gradient(135deg, #10b981, #059669)'
    : 'linear-gradient(135deg, #ef4444, #dc2626)'};
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px ${props => props.isActive
    ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'};
`

export const FeatureName = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}dd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
`

export const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  min-height: 42px;
`

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const CostBadge = styled.div`
  background: rgba(8, 145, 178, 0.1);
  color: #0891b2;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid rgba(8, 145, 178, 0.2);

  span {
    font-size: 1rem;
  }
`

export const ConfigButton = styled.button`
  background: linear-gradient(135deg, ${props => props.color}, ${props => props.color}dd);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => `${props.color}40`};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => `${props.color}50`};
  }
`
