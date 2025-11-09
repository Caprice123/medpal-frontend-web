import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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
          <Tagline>Katalog Pembelajaran Medis Berbasis Kredit</Tagline>
          <Description>
            Platform pembelajaran untuk mahasiswa kedokteran dengan 7 fitur interaktif.
            Gunakan kredit untuk mengakses fitur dan topik yang telah dikonfigurasi oleh admin.
          </Description>
        </BrandSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>7 Fitur Pembelajaran</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>💳</FeatureIcon>
            <FeatureTitle>Sistem Kredit Fleksibel</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Topik Terstruktur</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Dashboard Pribadi</FeatureTitle>
          </FeatureCard>
        </FeaturesGrid>

        <StatsSection>
          <StatItem>
            <StatValue>1,000+</StatValue>
            <StatLabel>Mahasiswa Aktif</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>10,000+</StatValue>
            <StatLabel>Sesi Belajar</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>95%</StatValue>
            <StatLabel>Tingkat Kepuasan</StatLabel>
          </StatItem>
        </StatsSection>
      </LeftPanel>

      {/* Right Panel - Sign In Form */}
      <RightPanel>
        <MobileLogo>
          <MobileLogoIcon>🏥</MobileLogoIcon>
          <MobileLogoText>MedPalm</MobileLogoText>
          <MobileTagline>Platform Pembelajaran Medis Berbasis Kredit</MobileTagline>
        </MobileLogo>

        <SignInCard>
          <SignInHeader>
            <SignInTitle>Selamat Datang Kembali</SignInTitle>
            <SignInSubtitle>
              Masuk untuk mengakses katalog pembelajaran dan pantau kredit Anda
            </SignInSubtitle>
          </SignInHeader>

          <GoogleButtonWrapper>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </GoogleButtonWrapper>

          <Divider>Login Aman dengan Google</Divider>
        </SignInCard>
      </RightPanel>
    </LoginContainer>
  )
}

export default Login
