import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '@/theme/colors'
import { logoutThunk } from '@/store/slices/authSlice'
import { deductCreditsThunk, fetchUserCreditsThunk } from '@/store/slices/creditsSlice'
import { useTokenRefresh } from '@/hooks/useTokenRefresh'

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.default};
`

const Header = styled.header`
  background: ${colors.background.paper};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.main};
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${colors.primary.main};
`

const UserName = styled.span`
  font-weight: 500;
  color: ${colors.text.primary};
`

const CreditsDisplay = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Button = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : colors.primary.main};
  color: ${props => props.variant === 'outline' ? colors.primary.main : 'white'};
  border: 2px solid ${colors.primary.main};
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.variant === 'outline' ? colors.primary.main : colors.primary.dark};
    color: white;
    transform: translateY(-2px);
  }
`

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`

const PageSubtitle = styled.p`
  color: ${colors.text.secondary};
  margin-bottom: 2rem;
`

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

const CatalogCard = styled.div`
  background: ${colors.background.paper};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${colors.primary.light};
  }
`

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${colors.primary.light}20, ${colors.secondary.light}20);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`

const CardDescription = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${colors.neutral.gray200};
`

const CreditCost = styled.span`
  font-weight: 600;
  color: ${colors.primary.main};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const UseButton = styled.button`
  background: ${colors.primary.main};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.primary.dark};
  }

  &:disabled {
    background: ${colors.neutral.gray300};
    cursor: not-allowed;
  }
`

const catalogs = [
  {
    id: 1,
    icon: '🔬',
    title: 'Asisten Diagnosis AI',
    description: 'Dapatkan saran diagnosis bertenaga AI berdasarkan gejala dan riwayat medis.',
    cost: 10,
  },
  {
    id: 2,
    icon: '💊',
    title: 'Pemeriksa Interaksi Obat',
    description: 'Periksa potensi interaksi obat dan kontraindikasi.',
    cost: 5,
  },
  {
    id: 3,
    icon: '📊',
    title: 'Analisis Laporan Lab',
    description: 'Unggah dan analisis laporan laboratorium dengan wawasan bertenaga AI.',
    cost: 15,
  },
  {
    id: 4,
    icon: '🩺',
    title: 'Pencarian Literatur Medis',
    description: 'Cari melalui jutaan makalah penelitian dan jurnal medis.',
    cost: 8,
  },
  {
    id: 5,
    icon: '🧬',
    title: 'Penilaian Risiko Genetik',
    description: 'Analisis data genetik untuk potensi risiko kesehatan dan kondisi.',
    cost: 20,
  },
  {
    id: 6,
    icon: '📋',
    title: 'Generator Rencana Perawatan',
    description: 'Buat rencana perawatan komprehensif berdasarkan diagnosis.',
    cost: 12,
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { balance, error, loading } = useSelector((state) => state.credits)

  // Enable automatic token refresh
  useTokenRefresh()

  // Fetch user credits on component mount
  useEffect(() => {
    dispatch(fetchUserCreditsThunk())
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Navigate anyway
      navigate('/login')
    }
  }

  const handleUseFeature = async (catalog) => {
    if (balance < catalog.cost) {
      alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
      return
    }

    try {
      await dispatch(
        deductCreditsThunk({
          featureId: catalog.id,
          amount: catalog.cost,
          featureName: catalog.title,
        })
      ).unwrap()

      alert(`${catalog.title} diaktifkan! ${catalog.cost} kredit dikurangkan.`)
    } catch (error) {
      alert(`Gagal menggunakan fitur: ${error}`)
    }
  }

  const handleTopUp = () => {
    // In a real app, this would open a payment modal
    alert('Fitur isi ulang segera hadir!')
  }

  return (
    <DashboardContainer>
      <Header>
        <Logo>
          <span>🏥</span>
          <span>MedPalm</span>
        </Logo>
        <UserSection>
          <CreditsDisplay>
            💎 {balance} Kredit
          </CreditsDisplay>
          <Button variant="outline" onClick={handleTopUp}>
            Isi Ulang
          </Button>
          <UserInfo>
            <Avatar src={user?.picture} alt={user?.name} />
            <UserName>{user?.name}</UserName>
          </UserInfo>
          <Button variant="outline" onClick={handleLogout}>
            Keluar
          </Button>
        </UserSection>
      </Header>

      <MainContent>
        <PageTitle>Katalog AI Medis</PageTitle>
        <PageSubtitle>
          Pilih dari berbagai alat dan fitur medis bertenaga AI kami
        </PageSubtitle>

        {error && (
          <div style={{
            background: colors.error.light + '20',
            color: colors.error.dark,
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <CatalogGrid>
          {catalogs.map((catalog) => (
            <CatalogCard key={catalog.id}>
              <CardIcon>{catalog.icon}</CardIcon>
              <CardTitle>{catalog.title}</CardTitle>
              <CardDescription>{catalog.description}</CardDescription>
              <CardFooter>
                <CreditCost>
                  💎 {catalog.cost} kredit
                </CreditCost>
                <UseButton
                  onClick={() => handleUseFeature(catalog)}
                  disabled={balance < catalog.cost}
                >
                  Gunakan Fitur
                </UseButton>
              </CardFooter>
            </CatalogCard>
          ))}
        </CatalogGrid>
      </MainContent>
    </DashboardContainer>
  )
}

export default Dashboard
