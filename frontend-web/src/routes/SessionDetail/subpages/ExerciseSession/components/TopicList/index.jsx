import { useTopicList } from './hook'
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
  LoadingSpinner,
  CreditBadge,
  FilterSection,
  FilterGroup,
  FilterLabel,
  Select,
  EmptyState,
  TopicDescription
} from './TopicList.styles'

const TopicList = () => {
    const { balance } = useSelector(state => state.credit)
    const { topics, isLoading } = useSelector(state => state.exercise)
    const { filters, handleFilterChange, handleStartTopic } = useTopicList()

    // Get unique universities and semesters for filters
    const universities = [...new Set(
        topics.flatMap(t => t.tags?.filter(tag => tag.type === 'university').map(tag => tag.name) || [])
    )]

    const semesters = [...new Set(
        topics.flatMap(t => t.tags?.filter(tag => tag.type === 'semester').map(tag => tag.name) || [])
    )].sort()

    return (
        <Container>
            <Header>
                <div>
                <Title>Pilih Topik Latihan</Title>
                <Subtitle>
                    Pilih topik latihan soal untuk meningkatkan pemahaman Anda
                </Subtitle>
                </div>
                <CreditBadge>
                💎 {balance} Kredit
                </CreditBadge>
            </Header>

            <TopicSelectionContainer>
                <FilterSection>
                <FilterGroup>
                    <FilterLabel>Universitas</FilterLabel>
                    <Select
                    value={filters.university}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    >
                    <option value="">Semua Universitas</option>
                    {universities.map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                    ))}
                    </Select>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Semester</FilterLabel>
                    <Select
                    value={filters.semester}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    >
                    <option value="">Semua Semester</option>
                    {semesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                    </Select>
                </FilterGroup>
                </FilterSection>

                {isLoading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <div style={{ marginTop: '1rem', color: '#6b7280' }}>
                    Memuat topik...
                    </div>
                </LoadingContainer>
                ) : topics.length === 0 ? (
                <EmptyState>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                    <h3>Belum Ada Topik</h3>
                    <p>Belum ada topik latihan yang tersedia saat ini</p>
                </EmptyState>
                ) : (
                <TopicGrid>
                    {topics.map((topic) => (
                    <TopicCard key={topic.id}>
                        <TopicHeader>
                        <TopicTitle>{topic.title}</TopicTitle>
                        <TopicDescription>{topic.description || 'Tidak ada deskripsi'}</TopicDescription>
                        </TopicHeader>

                        <TagContainer>
                        {topic.tags && topic.tags.map((tag, index) => (
                            <Tag key={index} type={tag.type}>
                            {tag.name}
                            </Tag>
                        ))}
                        </TagContainer>

                        <TopicFooter>
                        <div>
                            <QuestionCount>
                            {topic.questionCount || topic.questions?.length || 0} Soal
                            </QuestionCount>
                            <CostBadge>
                            💎 {topic.cost} kredit
                            </CostBadge>
                        </div>
                        <StartButton
                            onClick={() => handleStartTopic(topic)}
                            disabled={balance < topic.cost}
                        >
                            Mulai Latihan
                        </StartButton>
                        </TopicFooter>
                    </TopicCard>
                    ))}
                </TopicGrid>
                )}
            </TopicSelectionContainer>
        </Container>
    )
}

export default TopicList