import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import medPalIcon from '@/assets/icon.svg'
import { useNavbar } from './hooks/useNavbar'
import {
  NavbarBar,
  NavContent,
  Logo,
  LogoImage,
  NavLinks,
  NavLink,
  NavCtaGroup,
  NavCtaSecondary,
  NavCtaPrimary,
  BurgerButton,
  MobileMenu,
  MobileNavLink,
} from './Navbar.styles'

export default function Navbar({ scrollToSection }) {
  const navigate = useNavigate()
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, scrolled } = useNavbar()

  const handleNavClick = (id) => {
    scrollToSection(id)
    closeMobileMenu()
  }

  return (
    <>
      <NavbarBar $scrolled={scrolled}>
        <NavContent>
          <Logo to="/" aria-label="MedPal beranda">
            <LogoImage src={medPalIcon} alt="MedPal" />
          </Logo>

          <NavLinks>
            <NavLink onClick={() => handleNavClick('features')}>Fitur</NavLink>
            <NavLink onClick={() => handleNavClick('pricing')}>Harga</NavLink>
            <NavLink onClick={() => handleNavClick('how-it-works')}>Demo</NavLink>
            <NavLink onClick={() => handleNavClick('faq')}>FAQ</NavLink>
          </NavLinks>

          <NavCtaGroup>
            <NavCtaSecondary to="/sign-in">Masuk</NavCtaSecondary>
            <NavCtaPrimary to="/sign-in">Mulai Gratis</NavCtaPrimary>
          </NavCtaGroup>

          <BurgerButton onClick={toggleMobileMenu} aria-label="Buka menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </BurgerButton>
        </NavContent>
      </NavbarBar>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink onClick={() => handleNavClick('features')}>Fitur</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('pricing')}>Harga</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('how-it-works')}>Demo</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('faq')}>FAQ</MobileNavLink>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/sign-in')}
          style={{ marginTop: '2rem' }}
        >
          Mulai Gratis
        </Button>
        <Button
          variant="outline"
          size="large"
          fullWidth
          onClick={() => navigate('/sign-in')}
          style={{ marginTop: '0.75rem' }}
        >
          Masuk
        </Button>
      </MobileMenu>
    </>
  )
}
