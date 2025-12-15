import { useEffect } from 'react'
import {
  Container,
  Content,
  CalculatorsList,
  CalculatorCard,
  CalculatorTitle,
  CalculatorDescription,
  FieldCount,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyText
} from './Calculator.styles'
import { getCalculatorTopics } from '../../../../store/calculator/action'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '../../../../store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { generatePath, useNavigate } from 'react-router-dom'
import { CalculatorRoute } from '../../routes'
import { Filter } from './components/Filter'

function CalculatorPage() {
  const dispatch = useDispatch()
  const { topics, loading } = useSelector(state => state.calculator) 
  const navigate = useNavigate()

  // Fetch calculators on mount
  useEffect(() => {
    dispatch(getCalculatorTopics())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["kategori"] }))
    dispatch(fetchTags())
  }, [dispatch])

  const handleSelectCalculator = (calculator) => {
    navigate(generatePath(CalculatorRoute.detailRoute, { id: calculator.id }))
  }
  

    return (
      <Container>
        <Content>
          <Filter />

          {loading.isGetListCalculatorsLoading ? (
            <EmptyState>
              <LoadingSpinner style={{ margin: '0 auto' }} />
              <p>Loading calculators...</p>
            </EmptyState>
          ) : topics.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyText>
                Tidak ada kalkulator yang tersedia saat ini
              </EmptyText>
            </EmptyState>
          ) : (
            <>
              <CalculatorsList>
                {topics.map(calculator => (
                  <CalculatorCard
                    key={calculator.id}
                    onClick={() => handleSelectCalculator(calculator)}
                  >
                    <CalculatorTitle>{calculator.title}</CalculatorTitle>
                    <CalculatorDescription>
                      {calculator.description || 'Kalkulator untuk membantu perhitungan Anda'}
                    </CalculatorDescription>
                    {calculator.tags && calculator.tags.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '0.75rem'
                      }}>
                        {calculator.tags.map(tag => (
                          <span
                            key={tag.id}
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              marginBottom: "1rem",
                              background: 'rgba(107, 185, 232, 0.1)',
                              color: '#6BB9E8',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <FieldCount>
                      {calculator.fields?.length || 0} input field
                    </FieldCount>
                  </CalculatorCard>
                ))}
              </CalculatorsList>
            </>
          )}
        </Content>
      </Container>
    )
}

export default CalculatorPage
