import { Parallax } from 'react-scroll-parallax'
import Button from '@components/common/Button'
import { LinkButton } from '../Home.styles'
import {
  HeroSection as StyledHeroSection,
  HeroContent,
  HeroText,
  Badge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  HeroVisual,
  FeaturePreviewCard,
  PreviewIcon,
  PreviewText,
  PreviewTitle,
  PreviewDescription,
} from '../Home.styles'

export default function HeroSection({ scrollToSection }) {
  return (
    <StyledHeroSection>
      <Parallax speed={-5}>
        <HeroContent>
          <HeroText>
            <HeroTitle data-aos="fade-up" data-aos-delay="100">
              Cara mahasiswa kedokteran terbaik sukses — kini di genggaman Anda, didukung AI.
            </HeroTitle>
            <HeroSubtitle data-aos="fade-up" data-aos-delay="200">
              18.000+ flashcards, 20.000+ bank soal, simulasi OSCE berbasis AI, AI yang menjawab dengan referensi textbook dan jurnal ilmiah, medical calculators, serta AI assistant untuk menyusun laporan studi kasus dan skripsi.
            </HeroSubtitle>
            <HeroButtons data-aos="fade-up" data-aos-delay="300">
              <LinkButton to="/sign-in" variant="primary" size="large">
                Mulai Sekarang
              </LinkButton>
              <Button
                variant="outline"
                size="large"
                onClick={() => scrollToSection('features')}
              >
                Lihat Fitur
              </Button>
            </HeroButtons>
          </HeroText>

          <HeroVisual>
            <FeaturePreviewCard data-aos="fade-left" data-aos-delay="100">
              <PreviewIcon>📚</PreviewIcon>
              <PreviewText>
                <PreviewTitle>18.000+ Flashcards</PreviewTitle>
                <PreviewDescription>Materi lengkap semua blok</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
            <FeaturePreviewCard data-aos="fade-left" data-aos-delay="200">
              <PreviewIcon>📝</PreviewIcon>
              <PreviewText>
                <PreviewTitle>20.000+ Bank Soal</PreviewTitle>
                <PreviewDescription>Latihan UKMPPD & ujian blok</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
            <FeaturePreviewCard data-aos="fade-left" data-aos-delay="300">
              <PreviewIcon>🤖</PreviewIcon>
              <PreviewText>
                <PreviewTitle>AI Assistant</PreviewTitle>
                <PreviewDescription>Referensi textbook & jurnal</PreviewDescription>
              </PreviewText>
            </FeaturePreviewCard>
          </HeroVisual>
        </HeroContent>
      </Parallax>
    </StyledHeroSection>
  )
}
