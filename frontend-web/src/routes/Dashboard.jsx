import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '@config/colors'
import { logout } from '@store/auth/action'
import { getUserData } from '@utils/authToken'

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
`

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
  }
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
  border: 2px solid #0891b2;
`

const UserName = styled.span`
  font-weight: 500;
  color: #374151;

  @media (max-width: 480px) {
    display: none;
  }
`

const CreditsDisplay = styled.div`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(14, 116, 144, 0.2);
`

const Button = styled.button`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#0891b2'};
  color: ${props => props.variant === 'outline' ? '#0891b2' : 'white'};
  border: 2px solid #0891b2;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.variant === 'outline' ? '#0891b2' : '#0e7490'};
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.875rem;
    font-size: 0.875rem;
  }
`

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

const CatalogCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(14, 116, 144, 0.15);
    border-color: #0891b2;
  }
`

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(8, 145, 178, 0.1);
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
  color: #0891b2;
  margin-bottom: 0.5rem;
`

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

const CreditCost = styled.span`
  font-weight: 600;
  color: #0891b2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const UseButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

// Modal Styles
const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 900px;
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

const ModalHeader = styled.div`
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

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0;
`

const CloseButton = styled.button`
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

const ModalBody = styled.div`
  padding: 2rem;
`

// Session History Styles
const SessionsSection = styled.div`
  margin-bottom: 3rem;
`

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const CreateSessionButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.3);
  }
`

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SessionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0891b2;
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const SessionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(8, 145, 178, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const SessionInfo = styled.div`
  flex: 1;
`

const SessionName = styled.div`
  font-weight: 600;
  color: #0891b2;
  margin-bottom: 0.25rem;
`

const SessionDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`

const SessionCredit = styled.div`
  font-weight: 600;
  color: #0891b2;
  white-space: nowrap;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

const EmptyStateText = styled.div`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`

const EmptyStateSubtext = styled.div`
  font-size: 0.875rem;
`

const catalogs = [
  {
    id: 1,
    icon: '🔬',
    title: 'Asisten Diagnosis AI',
    description: 'Dapatkan saran diagnosis bertenaga AI berdasarkan gejala dan riwayat medis pasien.',
    cost: 10,
  },
  {
    id: 2,
    icon: '💊',
    title: 'Pemeriksa Interaksi Obat',
    description: 'Periksa potensi interaksi obat dan kontraindikasi untuk keamanan pasien.',
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
    description: 'Cari melalui jutaan makalah penelitian dan jurnal medis terkini.',
    cost: 8,
  },
  {
    id: 5,
    icon: '🧬',
    title: 'Penilaian Risiko Genetik',
    description: 'Analisis data genetik untuk potensi risiko kesehatan dan kondisi herediter.',
    cost: 20,
  },
  {
    id: 6,
    icon: '📋',
    title: 'Generator Rencana Perawatan',
    description: 'Buat rencana perawatan komprehensif berdasarkan diagnosis dan kondisi pasien.',
    cost: 12,
  },
  {
    id: 7,
    icon: '🎓',
    title: 'Materi Pembelajaran Interaktif',
    description: 'Akses materi pembelajaran kedokteran dengan metode interaktif dan AI.',
    cost: 7,
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(100) // Default balance, should fetch from API
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessions, setSessions] = useState([
    // Mock data - should be fetched from API
    {
      id: 1,
      featureName: 'Asisten Diagnosis AI',
      featureIcon: '🔬',
      creditUsed: 10,
      createdAt: new Date('2025-11-09T08:30:00'),
      status: 'completed'
    },
    {
      id: 2,
      featureName: 'Pemeriksa Interaksi Obat',
      featureIcon: '💊',
      creditUsed: 5,
      createdAt: new Date('2025-11-08T14:20:00'),
      status: 'completed'
    },
    {
      id: 3,
      featureName: 'Analisis Laporan Lab',
      featureIcon: '📊',
      creditUsed: 15,
      createdAt: new Date('2025-11-07T10:15:00'),
      status: 'completed'
    }
  ])

  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData()
    setUser(userData)

    // TODO: Fetch user sessions from API
  }, [])

  const handleLogout = () => {
    const onSuccess = () => {
      navigate('/sign-in')
    }
    dispatch(logout(onSuccess))
  }

  const handleUseFeature = (catalog) => {
    if (balance < catalog.cost) {
      alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
      return
    }

    // Deduct credits
    setBalance(prevBalance => prevBalance - catalog.cost)

    // Add new session to history
    const newSession = {
      id: sessions.length + 1,
      featureName: catalog.title,
      featureIcon: catalog.icon,
      creditUsed: catalog.cost,
      createdAt: new Date(),
      status: 'completed'
    }
    setSessions([newSession, ...sessions])

    // Close modal
    setIsModalOpen(false)

    alert(`${catalog.title} diaktifkan! ${catalog.cost} kredit dikurangkan.`)

    // TODO: Call API to create session and deduct credits from backend
  }

  const handleTopUp = () => {
    // In a real app, this would open a payment modal
    alert('Fitur isi ulang segera hadir!')
  }

  const formatDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(date).toLocaleDateString('id-ID', options)
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
          {user && (
            <UserInfo>
              {user.picture ? (
                <Avatar src={user.picture} alt={user.name} />
              ) : (
                <Avatar as="div" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0e7490, #14b8a6)',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <UserName>{user.name}</UserName>
            </UserInfo>
          )}
          {user?.role === 'admin' && (
            <Button onClick={() => navigate('/admin')}>
              Admin Panel
            </Button>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Keluar
          </Button>
        </UserSection>
      </Header>

      <MainContent>
        {/* Session History Section */}
        <SessionsSection>
          <SectionHeaderRow>
            <div>
              <PageTitle>Riwayat Sesi</PageTitle>
              <PageSubtitle>Lihat semua sesi pembelajaran yang telah Anda akses</PageSubtitle>
            </div>
            <CreateSessionButton onClick={() => setIsModalOpen(true)}>
              <span>+</span>
              Buat Sesi Baru
            </CreateSessionButton>
          </SectionHeaderRow>

          {sessions.length > 0 ? (
            <SessionsList>
              {sessions.map((session) => (
                <SessionCard key={session.id}>
                  <SessionIcon>{session.featureIcon}</SessionIcon>
                  <SessionInfo>
                    <SessionName>{session.featureName}</SessionName>
                    <SessionDate>{formatDate(session.createdAt)}</SessionDate>
                  </SessionInfo>
                  <SessionCredit>-{session.creditUsed} kredit</SessionCredit>
                </SessionCard>
              ))}
            </SessionsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <EmptyStateText>Belum ada sesi</EmptyStateText>
              <EmptyStateSubtext>Klik "Buat Sesi Baru" untuk memulai pembelajaran pertama Anda</EmptyStateSubtext>
            </EmptyState>
          )}
        </SessionsSection>
      </MainContent>

      {/* Feature Catalog Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Pilih Fitur Pembelajaran</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
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
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  )
}

export default Dashboard
