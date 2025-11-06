import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import styled from 'styled-components'
import { colors } from '@/theme/colors'
import { loginWithGoogleThunk } from '@/store/slices/authSlice'
import { fetchUserCreditsThunk } from '@/store/slices/creditsSlice'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${colors.neutral.white};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

const LeftPanel = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
    min-height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`

const BrandSection = styled.div`
  margin-bottom: 3rem;
`

const LogoText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
`

const LogoIcon = styled.div`
  font-size: 2rem;
`

const Tagline = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;

  @media (max-width: 968px) {
    font-size: 2rem;
  }
`

const Description = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
`

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const StatsSection = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    gap: 1.5rem;
  }
`

const StatItem = styled.div``

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`

const RightPanel = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${colors.background.default};
  position: relative;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`

const MobileLogo = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    display: block;
  }
`

const MobileLogoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`

const MobileLogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.main};
  margin-bottom: 0.25rem;
`

const MobileTagline = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`

const SignInCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: ${colors.curio.cardBg};
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    box-shadow: none;
  }
`

const SignInHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const SignInTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

const SignInSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
`

const GoogleButtonWrapper = styled.div`
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

const ErrorMessage = styled.div`
  background: ${colors.error.light}20;
  color: ${colors.error.dark};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  border: 1px solid ${colors.error.light};
  text-align: center;
`

const Divider = styled.div`
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

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send Google credential to backend for verification and session creation
      const result = await dispatch(
        loginWithGoogleThunk(credentialResponse.credential)
      ).unwrap()

      // Fetch user credits after successful login
      await dispatch(fetchUserCreditsThunk()).unwrap()

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
  }

  return (
    <LoginContainer>
      {/* Left Panel - Branding & Features */}
      <LeftPanel>
        <BackButton to="/">
          ← Kembali ke Beranda
        </BackButton>

        <BrandSection>
          <LogoText>
            <LogoIcon>🏥</LogoIcon>
            MedPalm
          </LogoText>
          <Tagline>Ubah Konten Medis Jadi Pembelajaran Interaktif</Tagline>
          <Description>
            Platform AI yang mengubah dokumen, gambar, dan URL medis menjadi
            materi pembelajaran yang menarik dan mudah dipahami
          </Description>
        </BrandSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>Unggah Dokumen Medis</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔗</FeatureIcon>
            <FeatureTitle>Tempel URL Medis</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📸</FeatureIcon>
            <FeatureTitle>Bagikan Gambar Medis</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Buat Kuis Instan</FeatureTitle>
          </FeatureCard>
        </FeaturesGrid>

        <StatsSection>
          <StatItem>
            <StatValue>1.000+</StatValue>
            <StatLabel>Mahasiswa Kedokteran</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>5.000+</StatValue>
            <StatLabel>Kuis Dibuat</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>95%</StatValue>
            <StatLabel>Tingkat Keberhasilan</StatLabel>
          </StatItem>
        </StatsSection>
      </LeftPanel>

      {/* Right Panel - Sign In Form */}
      <RightPanel>
        <MobileLogo>
          <MobileLogoIcon>🏥</MobileLogoIcon>
          <MobileLogoText>MedPalm</MobileLogoText>
          <MobileTagline>Platform Pembelajaran Medis AI</MobileTagline>
        </MobileLogo>

        <SignInCard>
          <SignInHeader>
            <SignInTitle>Selamat Datang</SignInTitle>
            <SignInSubtitle>
              Masuk untuk melanjutkan pembelajaran medis Anda
            </SignInSubtitle>
          </SignInHeader>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <GoogleButtonWrapper>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </GoogleButtonWrapper>

          <Divider>Login Aman dengan Google</Divider>
        </SignInCard>
      </RightPanel>
    </LoginContainer>
  )
}

export default Login
