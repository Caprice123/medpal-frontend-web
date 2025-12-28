import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Card, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { fetchFeatures } from '@store/feature/action'
import { getUserData } from '@utils/authToken'

const DashboardContainer = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0fdfa;
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
  color: #06b6d4;
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

// Using common Card component - no custom card needed

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

const FeatureFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`

const CreditCost = styled.span`
  font-weight: 600;
  color: #06b6d4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux selectors
  const { balance } = useSelector(state => state.credit)
  const { features } = useSelector(state => state.feature)
  const { isLoadingFeatures } = useSelector(state => state.feature.loading)

  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData()
    setUser(userData)

    // Fetch features
    fetchUserData()
  }, [dispatch])

  const fetchUserData = async () => {
    try {
      // Fetch features
      await dispatch(fetchFeatures())
    } catch (error) {
      console.error('Failed to fetch features:', error)
    }
  }

  const handleUseFeature = async (feature) => {
      // Determine session type based on feature
      const sessionType = feature.sessionType

      // For flashcard, navigate to dedicated flashcard page
      if (sessionType === 'flashcard') {
        navigate('/flashcards')
        return
      }

      // For exercise, navigate to dedicated exercise page
      if (sessionType === 'exercise') {
        navigate('/exercises')
        return
      }

      if (sessionType === 'calculator') {
        navigate('/calculators')
        return
      }

      if (sessionType === 'anatomy') {
        navigate('/anatomy-quiz')
        return
      }

      if (sessionType === 'summary_notes') {
        navigate('/summary-notes')
        return
      }

      if (sessionType === 'mcq') {
        navigate('/multiple-choice')
        return
      }

      if (sessionType == "chatbot") {
        navigate("/chatbot")
        return
      }

      if (sessionType === "skripsi_builder") {
        navigate("/skripsi/sets")
        return
      }

      // For calculator, navigate to dedicated calculator page
      if (!sessionType) {
        navigate('/calculators')
        return
      }
  }

  return (
    <DashboardContainer>
      <MainContent>
        <PageTitle>Fitur Pembelajaran</PageTitle>
        <PageSubtitle>Pilih fitur yang ingin Anda gunakan untuk memulai pembelajaran</PageSubtitle>

        {isLoadingFeatures ? (
          <EmptyState>
            <EmptyStateIcon>⏳</EmptyStateIcon>
            <EmptyStateText>Memuat fitur...</EmptyStateText>
          </EmptyState>
        ) : features.length > 0 ? (
          <CatalogGrid>
            {features.map((feature) => {
              // Get access type color
              const getAccessColor = (accessType) => {
                switch (accessType) {
                  case 'subscription': return '#10b981'
                  case 'credits': return '#06b6d4'
                  case 'subscription_and_credits': return '#f59e0b'
                  case 'free': return '#6b7280'
                  default: return '#06b6d4'
                }
              }

              // Get icon based on access type
              const getAccessIcon = (accessType) => {
                switch (accessType) {
                  case 'subscription': return '🎯'
                  case 'credits': return '💎'
                  case 'subscription_and_credits': return '🎯💎'
                  case 'free': return '✨'
                  default: return '💎'
                }
              }

              const canUse = feature.accessType === 'subscription' ||
                            feature.accessType === 'subscription_and_credits' ||
                            feature.accessType === 'free' ||
                            balance >= feature.cost

              return (
                <Card key={feature.id} shadow hoverable>
                  <CardBody>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <FeatureTitle>{feature.name}</FeatureTitle>
                    <FeatureDescription>{feature.description}</FeatureDescription>
                    <FeatureFooter>
                      <CreditCost style={{ color: getAccessColor(feature.accessType) }}>
                        {getAccessIcon(feature.accessType)} {feature.accessDescription || `${feature.cost} kredit`}
                      </CreditCost>
                      <Button
                        variant="primary"
                        onClick={() => handleUseFeature(feature)}
                        disabled={!canUse}
                      >
                        Gunakan Fitur
                      </Button>
                    </FeatureFooter>
                  </CardBody>
                </Card>
              )
            })}
          </CatalogGrid>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📚</EmptyStateIcon>
            <EmptyStateText>Tidak ada fitur tersedia</EmptyStateText>
            <EmptyStateSubtext>Silakan hubungi administrator</EmptyStateSubtext>
          </EmptyState>
        )}
      </MainContent>
    </DashboardContainer>
  )
}

export default Dashboard
