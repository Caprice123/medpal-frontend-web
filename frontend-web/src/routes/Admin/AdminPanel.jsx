import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '@utils/authToken'
import styled from 'styled-components'

const AdminContainer = styled.div`
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
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
`

const BackButton = styled.button`
  background: transparent;
  color: #0891b2;
  border: 2px solid #0891b2;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0891b2;
    color: white;
    transform: translateY(-2px);
  }
`

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.5rem;
`

const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
`

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: ${props => props.active ? '#0891b2' : '#6b7280'};
  border-bottom: 3px solid ${props => props.active ? '#0891b2' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;

  &:hover {
    color: #0891b2;
  }
`

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

const AddButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.3);
  }
`

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FeatureCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0891b2;
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.1);
  }
`

const FeatureInfo = styled.div`
  flex: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
`

const FeatureIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: rgba(8, 145, 178, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FeatureDetails = styled.div``

const FeatureName = styled.div`
  font-weight: 600;
  color: #0891b2;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
`

const FeatureDescription = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`

const FeatureCost = styled.div`
  font-weight: 600;
  color: #0891b2;
  margin-right: 1rem;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#ef4444' : '#0891b2'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

function AdminPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('features')
  const [features, setFeatures] = useState([
    // Mock data - will be replaced with API calls
    {
      id: 1,
      name: 'Asisten Diagnosis AI',
      description: 'Dapatkan saran diagnosis bertenaga AI berdasarkan gejala dan riwayat medis pasien.',
      icon: '🔬',
      cost: 10,
      isActive: true
    },
    {
      id: 2,
      name: 'Pemeriksa Interaksi Obat',
      description: 'Periksa potensi interaksi obat dan kontraindikasi untuk keamanan pasien.',
      icon: '💊',
      cost: 5,
      isActive: true
    }
  ])

  useEffect(() => {
    const userData = getUserData()

    // Check if user is admin
    if (!userData || userData.role !== 'admin') {
      navigate('/dashboard')
      return
    }

    setUser(userData)

    // TODO: Fetch features from API
  }, [navigate])

  const handleAddFeature = () => {
    // TODO: Open modal to add new feature
    alert('Fitur tambah feature akan segera hadir!')
  }

  const handleEditFeature = (featureId) => {
    // TODO: Open modal to edit feature
    alert(`Edit feature ${featureId}`)
  }

  const handleDeleteFeature = (featureId) => {
    if (confirm('Apakah Anda yakin ingin menghapus fitur ini?')) {
      // TODO: Delete feature via API
      setFeatures(features.filter(f => f.id !== featureId))
    }
  }

  const handleManageTopics = (featureId) => {
    // TODO: Navigate to topic management page
    alert(`Manage topics for feature ${featureId}`)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <AdminContainer>
      <Header>
        <Logo>
          <span>🏥</span>
          <span>MedPalm Admin</span>
        </Logo>
        <BackButton onClick={() => navigate('/dashboard')}>
          Kembali ke Dashboard
        </BackButton>
      </Header>

      <MainContent>
        <PageTitle>Admin Panel</PageTitle>
        <PageSubtitle>Kelola fitur pembelajaran dan topik untuk mahasiswa</PageSubtitle>

        <TabContainer>
          <Tab
            active={activeTab === 'features'}
            onClick={() => setActiveTab('features')}
          >
            Kelola Fitur
          </Tab>
          <Tab
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          >
            Kelola User
          </Tab>
        </TabContainer>

        <ContentArea>
          {activeTab === 'features' && (
            <>
              <AddButton onClick={handleAddFeature}>
                <span>+</span>
                Tambah Fitur Baru
              </AddButton>

              {features.length > 0 ? (
                <FeaturesList>
                  {features.map((feature) => (
                    <FeatureCard key={feature.id}>
                      <FeatureInfo>
                        <FeatureIcon>{feature.icon}</FeatureIcon>
                        <FeatureDetails>
                          <FeatureName>{feature.name}</FeatureName>
                          <FeatureDescription>{feature.description}</FeatureDescription>
                        </FeatureDetails>
                      </FeatureInfo>
                      <FeatureCost>{feature.cost} kredit</FeatureCost>
                      <ActionButtons>
                        <ActionButton onClick={() => handleManageTopics(feature.id)}>
                          Topik
                        </ActionButton>
                        <ActionButton onClick={() => handleEditFeature(feature.id)}>
                          Edit
                        </ActionButton>
                        <ActionButton
                          variant="danger"
                          onClick={() => handleDeleteFeature(feature.id)}
                        >
                          Hapus
                        </ActionButton>
                      </ActionButtons>
                    </FeatureCard>
                  ))}
                </FeaturesList>
              ) : (
                <EmptyState>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <div>Belum ada fitur yang dibuat</div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Klik "Tambah Fitur Baru" untuk memulai
                  </div>
                </EmptyState>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <div>Manajemen User</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Fitur ini akan segera hadir
              </div>
            </EmptyState>
          )}
        </ContentArea>
      </MainContent>
    </AdminContainer>
  )
}

export default AdminPanel
