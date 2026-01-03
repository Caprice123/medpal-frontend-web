import {
  Footer,
  FooterContent,
  FooterColumn,
  FooterLogo,
  LogoIcon,
  FooterDescription,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterBottom,
} from '../Home.styles'

export default function FooterSection({ scrollToSection }) {
  return (
    <Footer>
      <FooterContent>
        <FooterColumn>
          <FooterLogo>
            <LogoIcon>
              <img src="/icon.jpg" alt="MedPalm Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            </LogoIcon>
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
            <FooterLink onClick={() => scrollToSection('pricing')}>Harga</FooterLink>
            <FooterLink onClick={() => scrollToSection('how-it-works')}>Cara Kerja</FooterLink>
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
  )
}
