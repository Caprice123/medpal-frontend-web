import {
  LandingContainer,
  Navbar,
  NavContent,
  Logo,
  LogoIcon,
  NavLinks,
  NavLink,
  CTAButton,
  HeroSection,
  HeroContent,
  HeroText,
  Badge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  PrimaryButton,
  SecondaryButton,
  HeroVisual,
  FeaturePreviewCard,
  PreviewIcon,
  PreviewText,
  PreviewTitle,
  PreviewDescription,
  FeaturesSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  HowItWorksSection,
  StepsGrid,
  StepCard,
  StepNumber,
  StepTitle,
  StepDescription,
  StatsSection,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  TestimonialSection,
  TestimonialGrid,
  TestimonialCard,
  TestimonialText,
  TestimonialAuthor,
  AuthorAvatar,
  AuthorInfo,
  AuthorName,
  AuthorRole,
  CTASection,
  CTAContent,
  CTATitle,
  CTASubtitle,
  CTAButtonLarge,
  TrustBadge,
  Footer,
  FooterContent,
  FooterColumn,
  FooterLogo,
  FooterDescription,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterBottom,
} from './Home.styles'

import { ParallaxProvider, Parallax } from 'react-scroll-parallax'

function Home() {

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <ParallaxProvider>
      <LandingContainer>
        {/* Navigation */}
        <Navbar>
        <NavContent>
          <Logo>
            <LogoIcon>🏥</LogoIcon>
            MedPalm
          </Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('features')}>Fitur</NavLink>
            <NavLink onClick={() => scrollToSection('how-it-works')}>Cara Kerja</NavLink>
            <NavLink onClick={() => scrollToSection('stats')}>Statistik</NavLink>
            <CTAButton to="/sign-in">Masuk</CTAButton>
          </NavLinks>
        </NavContent>
      </Navbar>

        {/* Hero Section */}
        <HeroSection>
          <Parallax speed={-5}>
            <HeroContent>
          <HeroText>
            <Badge>
              ✨ Platform Pembelajaran Medis AI
            </Badge>
            <HeroTitle>
              Belajar Kedokteran Lebih Cerdas dengan AI
            </HeroTitle>
            <HeroSubtitle>
              Platform revolusioner untuk mahasiswa kedokteran yang menggunakan AI
              untuk mengubah konten medis menjadi pembelajaran interaktif dengan sistem kredit yang fleksibel.
            </HeroSubtitle>
            <HeroButtons>
              <PrimaryButton to="/sign-in">
                Mulai Sekarang
              </PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection('features')}>
                Pelajari Lebih Lanjut
              </SecondaryButton>
            </HeroButtons>
            <TrustBadge>
              🔒 Dipercaya oleh 1,000+ Mahasiswa Kedokteran
            </TrustBadge>
          </HeroText>

          <HeroVisual>
            <FeaturePreviewCard>
              <PreviewIcon>📚</PreviewIcon>
              <PreviewText>
                <PreviewTitle>Katalog Lengkap</PreviewTitle>
                <PreviewDescription>7 fitur pembelajaran interaktif</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
            <FeaturePreviewCard>
              <PreviewIcon>💳</PreviewIcon>
              <PreviewText>
                <PreviewTitle>Sistem Kredit</PreviewTitle>
                <PreviewDescription>Akses fitur dengan kredit fleksibel</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
            <FeaturePreviewCard>
              <PreviewIcon>🎯</PreviewIcon>
              <PreviewText>
                <PreviewTitle>Topik Terstruktur</PreviewTitle>
                <PreviewDescription>Materi dari admin yang terpercaya</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
            </HeroVisual>
          </HeroContent>
        </Parallax>
      </HeroSection>

      {/* Features Section */}
      <Parallax speed={3}>
        <FeaturesSection id="features">
        <SectionContent>
          <SectionHeader>
            <SectionBadge>🚀 Fitur Unggulan</SectionBadge>
            <SectionTitle>Semua yang Anda Butuhkan untuk Belajar</SectionTitle>
            <SectionSubtitle>
              7 fitur pembelajaran yang dirancang khusus untuk mahasiswa kedokteran
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-2}>
            <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>Pembelajaran Interaktif</FeatureTitle>
              <FeatureDescription>
                Akses 7 fitur pembelajaran yang dirancang khusus untuk meningkatkan
                pemahaman materi kedokteran dengan metode yang interaktif dan engaging.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>💳</FeatureIcon>
              <FeatureTitle>Sistem Kredit Fleksibel</FeatureTitle>
              <FeatureDescription>
                Gunakan kredit untuk mengakses fitur yang Anda butuhkan. Kredit akan
                otomatis terpotong saat menggunakan fitur tertentu.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Dashboard Pribadi</FeatureTitle>
              <FeatureDescription>
                Lihat riwayat fitur yang telah Anda akses, pantau penggunaan kredit,
                dan kelola pembelajaran Anda dalam satu tempat.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureTitle>Topik Terstruktur</FeatureTitle>
              <FeatureDescription>
                Setiap fitur memiliki topik yang sudah dikonfigurasi oleh admin,
                memastikan konten yang relevan dan terstruktur dengan baik.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🔐</FeatureIcon>
              <FeatureTitle>Keamanan Terjamin</FeatureTitle>
              <FeatureDescription>
                Login aman dengan Google OAuth, data Anda terlindungi dengan
                enkripsi tingkat enterprise.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Responsif & Cepat</FeatureTitle>
              <FeatureDescription>
                Akses dari perangkat apapun - mobile, tablet, atau PC. Interface
                yang responsif dan performa yang cepat.
              </FeatureDescription>
            </FeatureCard>
            </FeaturesGrid>
          </Parallax>
        </SectionContent>
      </FeaturesSection>
    </Parallax>

    {/* How It Works Section */}
    <Parallax speed={2}>
      <HowItWorksSection id="how-it-works">
        <SectionContent>
          <SectionHeader>
            <SectionBadge>📖 Cara Kerja</SectionBadge>
            <SectionTitle>Mulai Belajar dalam 3 Langkah Mudah</SectionTitle>
            <SectionSubtitle>
              Proses yang sederhana dan cepat untuk memulai perjalanan belajar Anda
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <StepsGrid>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Daftar & Login</StepTitle>
              <StepDescription>
                Buat akun dengan mudah menggunakan Google. Proses pendaftaran
                hanya membutuhkan beberapa detik.
              </StepDescription>
            </StepCard>

            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Pilih Fitur</StepTitle>
              <StepDescription>
                Lihat popup katalog fitur yang tersedia, pilih fitur yang ingin
                Anda gunakan dari 7 opsi yang tersedia.
              </StepDescription>
            </StepCard>

            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Mulai Belajar</StepTitle>
              <StepDescription>
                Pilih topik yang telah dikonfigurasi admin, kredit akan otomatis
                terpotong, dan Anda siap belajar!
              </StepDescription>
            </StepCard>
            </StepsGrid>
          </Parallax>
        </SectionContent>
      </HowItWorksSection>
    </Parallax>

    {/* Stats Section */}
    <Parallax speed={-3}>
      <StatsSection id="stats">
        <SectionContent>
          <SectionHeader>
            <SectionTitle>
              Dipercaya oleh Mahasiswa Kedokteran
            </SectionTitle>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue>1,000+</StatValue>
              <StatLabel>Mahasiswa Aktif</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>7</StatValue>
              <StatLabel>Fitur Pembelajaran</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>10,000+</StatValue>
              <StatLabel>Sesi Belajar</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>95%</StatValue>
              <StatLabel>Tingkat Kepuasan</StatLabel>
            </StatCard>
          </StatsGrid>
        </SectionContent>
      </StatsSection>
    </Parallax>

    {/* Testimonial Section */}
    <Parallax speed={1}>
      <TestimonialSection>
        <SectionContent>
          <SectionHeader>
            <SectionBadge>💬 Testimoni</SectionBadge>
            <SectionTitle>Apa Kata Mahasiswa Kami</SectionTitle>
            <SectionSubtitle>
              Dengar pengalaman dari mahasiswa kedokteran yang telah menggunakan MedPalm
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <TestimonialGrid>
            <TestimonialCard>
              <TestimonialText>
                Platform ini sangat membantu saya dalam memahami materi kedokteran yang kompleks.
                Fitur-fiturnya interaktif dan sistem kredit membuat belajar lebih fleksibel!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>AR</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Ahmad Rizki</AuthorName>
                  <AuthorRole>Mahasiswa FK UI</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                Sangat terstruktur dan mudah digunakan. Dashboard pribadi membantu saya
                melacak progress pembelajaran. Highly recommended untuk teman-teman koas!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>SP</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Siti Permata</AuthorName>
                  <AuthorRole>Mahasiswa FK UGM</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>

            <TestimonialCard>
              <TestimonialText>
                Interface yang responsif dan modern. Bisa diakses dari HP saat di rumah sakit.
                7 fitur pembelajaran benar-benar lengkap untuk kebutuhan kuliah!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>BW</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Budi Wijaya</AuthorName>
                  <AuthorRole>Mahasiswa FK UNAIR</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
            </TestimonialGrid>
          </Parallax>
        </SectionContent>
      </TestimonialSection>
    </Parallax>

    {/* CTA Section */}
    <Parallax speed={2}>
      <CTASection>
        <CTAContent>
          <CTATitle>
            Siap Meningkatkan Pembelajaran Anda?
          </CTATitle>
          <CTASubtitle>
            Bergabunglah dengan ribuan mahasiswa kedokteran yang telah meningkatkan
            pembelajaran mereka dengan MedPalm. Mulai gratis hari ini!
          </CTASubtitle>
          <CTAButtonLarge to="/sign-in">
            Mulai Belajar Sekarang
          </CTAButtonLarge>
        </CTAContent>
      </CTASection>
    </Parallax>

    {/* Footer */}
    <Footer>
        <FooterContent>
          <FooterColumn>
            <FooterLogo>
              <LogoIcon>🏥</LogoIcon>
              MedPalm
            </FooterLogo>
            <FooterDescription>
              Platform pembelajaran medis berbasis AI yang membantu mahasiswa
              kedokteran belajar lebih efektif dan efisien.
            </FooterDescription>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Produk</FooterTitle>
            <FooterLinks>
              <FooterLink onClick={() => scrollToSection('features')}>Fitur</FooterLink>
              <FooterLink onClick={() => scrollToSection('how-it-works')}>Cara Kerja</FooterLink>
              <FooterLink onClick={() => scrollToSection('stats')}>Statistik</FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Perusahaan</FooterTitle>
            <FooterLinks>
              <FooterLink>Tentang Kami</FooterLink>
              <FooterLink>Kontak</FooterLink>
              <FooterLink>Blog</FooterLink>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Legal</FooterTitle>
            <FooterLinks>
              <FooterLink>Kebijakan Privasi</FooterLink>
              <FooterLink>Syarat & Ketentuan</FooterLink>
            </FooterLinks>
          </FooterColumn>
        </FooterContent>

        <FooterBottom>
          © 2025 MedPalm. All rights reserved.
        </FooterBottom>
      </Footer>
    </LandingContainer>
  </ParallaxProvider>
  )
}

export default Home
