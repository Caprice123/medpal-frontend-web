import styled from 'styled-components'

export const Container = styled.div`

  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Header = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`

export const BackButton = styled.button`
  background: transparent;
  color: #6BB9E8;
  border: 2px solid #6BB9E8;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  min-height: 44px;

  &:hover {
    background: linear-gradient(135deg, #6BB9E8, #8DC63F);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const TitleSection = styled.div`
  flex: 1;
`

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.9375rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`

export const ActionButton = styled.button`
  background: ${props => props.secondary
    ? 'white'
    : 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)'};
  color: ${props => props.secondary ? '#374151' : 'white'};
  border: ${props => props.secondary ? '1px solid #d1d5db' : 'none'};
  padding: 0.625rem 1.25rem;
  min-height: 44px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.secondary ? 'none' : '0 4px 15px rgba(107, 185, 232, 0.4)'};

  &:hover {
    background: ${props => props.secondary
      ? '#f9fafb'
      : 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary
      ? '0 2px 8px rgba(0, 0, 0, 0.1)'
      : '0 6px 20px rgba(141, 198, 63, 0.5)'};
  }

  &:active {
    transform: translateY(0);
  }
`

export const TableContainer = styled.div`
  margin-top: 1rem;
`

export const EmptyState = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  margin-top: 1.5rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    font-size: 0.9375rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.875rem;
    }
  }
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => {
    if (props.status === 'active') {
      return `
        background: rgba(141, 198, 63, 0.15);
        color: #6BA32E;
      `
    } else if (props.status === 'inactive') {
      return `
        background: rgba(239, 68, 68, 0.15);
        color: #dc2626;
      `
    } else if (props.status === 'pending') {
      return `
        background: rgba(245, 158, 11, 0.15);
        color: #d97706;
      `
    }
    return `
      background: #e5e7eb;
      color: #6b7280;
    `
  }}
`

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => {
    if (props.role === 'admin') {
      return `
        background: rgba(107, 185, 232, 0.15);
        color: #4A9ED4;
      `
    } else if (props.role === 'editor') {
      return `
        background: rgba(141, 198, 63, 0.15);
        color: #6BA32E;
      `
    }
    return `
      background: #e5e7eb;
      color: #6b7280;
    `
  }}
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`

export const TableActionButton = styled.button`
  background: transparent;
  color: ${props => props.danger ? '#ef4444' : '#6BB9E8'};
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-height: 32px;
  min-width: 60px;

  &:hover {
    background: ${props => props.danger
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(107, 185, 232, 0.1)'};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    min-height: 40px;
    min-width: 70px;
  }
`
