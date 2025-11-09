import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import {
  BrandSection,
  LeftPanel,
  LoginContainer,
  LogoIcon,
  LogoText,
  Tagline,
  Description,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  BackButton,
  RightPanel,
  MobileLogo,
  MobileLogoIcon,
  MobileLogoText,
  MobileTagline,
  SignInCard,
  SignInHeader,
  SignInTitle,
  SignInSubtitle,
  ErrorMessage,
  GoogleButtonWrapper,
  Divider,
  StatsSection,
  StatItem,
  StatValue,
  StatLabel
} from './Login.styles'
import { login } from '@store/auth/action'

export function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGoogleSuccess = async (credentialResponse) => {
    const onSuccess = () => {
        navigate('/dashboard')
    }
    
    await dispatch(login(credentialResponse.credential, onSuccess))
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
