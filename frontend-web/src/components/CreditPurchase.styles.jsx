import styled from 'styled-components'

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 95vh;
  }
`

export const ModalHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

export const ModalBody = styled.div`
  padding: 2rem;
`

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const PlanCard = styled.div`
  background: ${props => props.isPopular
    ? 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'};
  border: 2px solid ${props => props.isPopular ? '#0891b2' : '#e5e7eb'};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isPopular
      ? 'linear-gradient(90deg, #0891b2, #14b8a6, #0891b2)'
      : '#e5e7eb'};
    background-size: 200% 100%;
    animation: ${props => props.isPopular ? 'shimmer 3s linear infinite' : 'none'};
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(14, 116, 144, 0.2);
    border-color: ${props => props.isPopular ? '#14b8a6' : '#0891b2'};
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

export const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, rgba(8, 145, 178, 0.1), rgba(20, 184, 166, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin: 0 auto 0.75rem;
  transition: all 0.3s ease;

  ${PlanCard}:hover & {
    transform: rotate(10deg) scale(1.1);
    background: linear-gradient(135deg, rgba(8, 145, 178, 0.2), rgba(20, 184, 166, 0.2));
  }
`

export const PlanName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0891b2, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
  text-align: center;
`

export const StatsContainer = styled.div`
  background: rgba(8, 145, 178, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(8, 145, 178, 0.1);
`

export const PlanCredits = styled.div`
  font-size: 2.5rem;
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
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
`

export const PriceContainer = styled.div`
  text-align: center;
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

export const DiscountInfo = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;
`

export const OriginalPrice = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 0.25rem;
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

export const PurchaseButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(14, 116, 144, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 116, 144, 0.4);
    background: linear-gradient(135deg, #0891b2, #14b8a6);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

export const InfoSection = styled.div`
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

export const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: #0f766e;
  line-height: 1.6;
  margin: 0;
`

export const StepsList = styled.ol`
  margin: 0.5rem 0 0 1.5rem;
  padding: 0;
  font-size: 0.875rem;
  color: #0f766e;
  line-height: 1.8;
`
