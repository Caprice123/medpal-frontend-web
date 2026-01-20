import styled from 'styled-components'

export const Card = styled.div`
  background: ${props => props.isActive
    ? 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)'
    : 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'};
  border: 2px solid ${props => props.isActive ? '#0891b2' : '#d1d5db'};
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isActive ? 1 : 0.6};
  overflow: hidden;
  filter: ${props => props.isActive ? 'none' : 'grayscale(0.5)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.isActive
      ? 'linear-gradient(90deg, #0891b2, #14b8a6, #0891b2)'
      : '#d1d5db'};
    background-size: 200% 100%;
    animation: ${props => props.isActive ? 'shimmer 3s linear infinite' : 'none'};
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  &:hover {
    transform: ${props => props.isActive ? 'translateY(-4px) scale(1.01)' : 'translateY(-2px)'};
    box-shadow: ${props => props.isActive
      ? '0 12px 24px rgba(14, 116, 144, 0.2)'
      : '0 8px 16px rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.isActive ? '#14b8a6' : '#9ca3af'};
  }
`

export const PopularBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5), 0 0 20px rgba(236, 72, 153, 0.3);
  animation: pulseGlow 2s ease-in-out infinite;
  border: 1.5px solid rgba(255, 255, 255, 0.5);

  @keyframes pulseGlow {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5), 0 0 20px rgba(236, 72, 153, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.6), 0 0 30px rgba(236, 72, 153, 0.5);
    }
  }

  &::before {
    content: '🔥';
    margin-right: 0.25rem;
    animation: flicker 1.5s ease-in-out infinite;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const IconWrapper = styled.div`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(8, 145, 178, 0.1), rgba(20, 184, 166, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: rotate(10deg) scale(1.1);
    background: linear-gradient(135deg, rgba(8, 145, 178, 0.2), rgba(20, 184, 166, 0.2));
  }
`

export const PlanName = styled.h3`
  font-size: 1.125rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0891b2, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  flex: 1;
`

export const PlanDescription = styled.p`
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  min-height: 32px;
`

export const StatsContainer = styled.div`
  background: rgba(8, 145, 178, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(8, 145, 178, 0.1);
`

export const PlanCredits = styled.div`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #0891b2, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  text-align: center;
  line-height: 1;
`

export const CreditsLabel = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
`

export const PriceContainer = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
`

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.25rem;

  span {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
`

export const PricePerCredit = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 500;
`

export const DiscountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(146, 64, 14, 0.2);
  animation: wiggle 1s ease-in-out infinite;

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }

  &::before {
    content: '🎉';
  }
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`

export const ActionButton = styled.button`
  flex: 1;
  background: ${props => {
    if (props.variant === 'danger') return '#ef4444';
    if (props.variant === 'warning') return '#f59e0b';
    return '#0891b2';
  }};
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`
