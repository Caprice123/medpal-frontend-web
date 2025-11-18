import { useAttemptHistory } from './hook'
import { useSelector } from 'react-redux'
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopicSelectionContainer,
  TopicGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  TagContainer,
  Tag,
  TopicFooter,
  QuestionCount,
  CostBadge,
  StartButton,
  LoadingContainer,
  LoadingSpinner
} from './AttemptHistory.styles'
import Pagination from '@components/Pagination'


const AttemptHistory = ({ setSelectedAttempt, setCurrentView }) => {
    const { currentPage, setCurrentPage, handleTryAgain } = useAttemptHistory(setSelectedAttempt)

    const { sessionAttempts: attempts, pagination, loading } = useSelector(state => state.session)

    return (
        <Container>
            <Header>
            <div>
                <Title>Riwayat Percobaan</Title>
                <Subtitle>
                Lihat semua percobaan latihan Anda
                </Subtitle>
            </div>
            <StartButton
                onClick={handleTryAgain}
                style={{
                alignSelf: 'flex-start',
                marginTop: '1rem'
                }}
            >
                🔄 Coba Lagi
            </StartButton>
            </Header>
    
            <TopicSelectionContainer>
            <TopicGrid>
                {attempts.map((attempt) => (
                <TopicCard
                    key={attempt.id}
                    onClick={() => {
                    if (attempt.status === 'completed') {
                        setSelectedAttempt(attempt)
                        setCurrentView("result")
                    }
                    }}
                    style={{ cursor: attempt.status === 'completed' ? 'pointer' : 'default' }}
                >
                    <TopicHeader>
                    <TopicTitle>Percobaan #{attempt.attemptNumber}</TopicTitle>
                    </TopicHeader>
    
                    <TagContainer>
                    <Tag type="status">
                        {attempt.status === 'completed' ? '✓ Selesai' :
                        attempt.status === 'active' ? '▶ Aktif' : '○ Belum dimulai'}
                    </Tag>
                    {attempt.status === 'completed' && (
                        <Tag type="score">
                        Skor: {attempt.correctQuestion}/{attempt.totalQuestion} ({attempt.score}%)
                        </Tag>
                    )}
                    </TagContainer>
    
                    <TopicFooter>
                    <div>
                        <QuestionCount>
                        {attempt.total_questions || 0} Soal
                        </QuestionCount>
                        <CostBadge>
                        💎 {attempt.credits_used} kredit
                        </CostBadge>
                    </div>
                    {attempt.status === 'completed' && (
                        <StartButton
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAttempt(attempt)
                            setCurrentView("result")
                        }}
                        >
                        Lihat Hasil
                        </StartButton>
                    )}
                    </TopicFooter>
                </TopicCard>
                ))}
            </TopicGrid>
    
            {/* Pagination Controls */}
            <Pagination
                currentPage={currentPage}
                isLastPage={pagination.isLastPage}
                onPageChange={setCurrentPage}
                isLoading={loading.isLoadingAttempts}
            />
            </TopicSelectionContainer>
        </Container>
    )
}

export default AttemptHistory