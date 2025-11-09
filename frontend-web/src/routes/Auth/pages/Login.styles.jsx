import { Link } from 'react-router-dom';
import { colors } from '@config/colors';
import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f0fdfa;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const LeftPanel = styled.div`
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  color: white;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
    min-height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-4px);
  }
`

export const BrandSection = styled.div`
  margin-bottom: 3rem;
`

export const LogoText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
`

export const LogoIcon = styled.div`
  font-size: 2rem;
`

export const Tagline = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;

  @media (max-width: 968px) {
    font-size: 2rem;
  }
`

export const Description = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
`

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
`

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

export const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  margin-bottom: 0.75rem;
`

export const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
`

export const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 968px) {
    gap: 1.5rem;
  }
`

export const StatItem = styled.div`
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${colors.gradient.light1} 0%, ${colors.gradient.light2} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.85;
`

export const RightPanel = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  position: relative;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`

export const MobileLogo = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    display: block;
  }
`

export const MobileLogoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`

export const MobileLogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin-bottom: 0.25rem;
`

export const MobileTagline = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`

export const SignInCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(14, 116, 144, 0.1);
  border: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    box-shadow: 0 2px 10px rgba(14, 116, 144, 0.08);
  }
`

export const SignInHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const SignInTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

export const SignInSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
`

export const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;

  > div {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    margin-top: 1.5rem;
  }
`

export const ErrorMessage = styled.div`
  background: ${colors.error.light}20;
  color: ${colors.error.dark};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  border: 1px solid ${colors.error.light};
  text-align: center;
`

export const Divider = styled.div`
  text-align: center;
  margin: 2rem 0;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 45%;
    height: 1px;
    background: ${colors.neutral.gray300};
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 45%;
    height: 1px;
    background: ${colors.neutral.gray300};
  }
`