import { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Endpoints from '@config/endpoint'
import { getToken } from '@utils/authToken'

const Container = styled.div`
  padding: 1rem 0;
`

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin-bottom: 0.5rem;
`

const SectionSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
`

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0891b2;
  }
`

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.3);
  }
`

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const TransactionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0891b2;
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.1);
  }
`

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const TransactionInfo = styled.div`
  flex: 1;
`

const TransactionId = styled.div`
  font-weight: 600;
  color: #0891b2;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`

const TransactionUser = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

const TransactionDescription = styled.div`
  color: #374151;
  font-size: 0.875rem;
`

const TransactionMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.status) {
      case 'completed':
        return 'background: #dcfce7; color: #166534;';
      case 'pending':
        return 'background: #fef3c7; color: #92400e;';
      case 'failed':
        return 'background: #fee2e2; color: #991b1b;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`

const TypeBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${props => {
    switch (props.type) {
      case 'purchase':
        return 'background: #dbeafe; color: #1e40af;';
      case 'deduction':
        return 'background: #fee2e2; color: #991b1b;';
      case 'bonus':
        return 'background: #fae8ff; color: #86198f;';
      case 'refund':
        return 'background: #dcfce7; color: #166534;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`

const TransactionAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.positive ? '#059669' : '#dc2626'};
`

const TransactionDate = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`

const TransactionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

const DetailItem = styled.div``

const DetailLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`

const DetailValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.125rem;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`

const PaginationButton = styled.button`
  background: white;
  color: #0891b2;
  border: 1px solid #0891b2;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #0891b2;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PaginationInfo = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  })
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
    total: 0,
    hasMore: false
  })

  useEffect(() => {
    fetchTransactions()
  }, [filters, pagination.offset])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const token = getToken()
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset
      })

      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)

      const response = await axios.get(
        `${Endpoints.credits}/transactions/all?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setTransactions(response.data.data.transactions)
      setPagination(prev => ({
        ...prev,
        total: response.data.data.pagination.total,
        hasMore: response.data.data.pagination.hasMore
      }))
      setError(null)
    } catch (err) {
      setError('Failed to load transactions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPagination(prev => ({ ...prev, offset: 0 })) // Reset to first page
  }

  const handleConfirmPayment = async (transactionId, status) => {
    const confirmMessage = status === 'completed'
      ? 'Are you sure you want to approve this payment?'
      : 'Are you sure you want to reject this payment?'

    if (!confirm(confirmMessage)) return

    try {
      const token = getToken()
      await axios.post(
        `${Endpoints.credits}/confirm/${transactionId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchTransactions()
      alert(`Payment ${status === 'completed' ? 'approved' : 'rejected'} successfully!`)
    } catch (err) {
      alert('Failed to update payment: ' + (err.response?.data?.message || err.message))
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount, type) => {
    const prefix = amount > 0 ? '+' : ''
    return `${prefix}${amount} credits`
  }

  const formatPrice = (price) => {
    if (!price) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handlePrevPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }))
  }

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }))
  }

  if (loading && transactions.length === 0) {
    return <LoadingState>Loading transactions...</LoadingState>
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <HeaderSection>
        <SectionTitle>Credit Transactions</SectionTitle>
        <SectionSubtitle>View and manage all credit transactions</SectionSubtitle>
      </HeaderSection>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>Type</FilterLabel>
          <Select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="deduction">Deduction</option>
            <option value="bonus">Bonus</option>
            <option value="refund">Refund</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <Select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Select>
        </FilterGroup>

        <RefreshButton onClick={fetchTransactions}>
          Refresh
        </RefreshButton>
      </FilterSection>

      {transactions.length > 0 ? (
        <>
          <TransactionsList>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id}>
                <TransactionHeader>
                  <TransactionInfo>
                    <TransactionId>Transaction #{transaction.id}</TransactionId>
                    <TransactionUser>User ID: {transaction.userId}</TransactionUser>
                    {transaction.description && (
                      <TransactionDescription>{transaction.description}</TransactionDescription>
                    )}
                  </TransactionInfo>

                  <TransactionMeta>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <TypeBadge type={transaction.type}>{transaction.type}</TypeBadge>
                      {transaction.paymentStatus && (
                        <StatusBadge status={transaction.paymentStatus}>
                          {transaction.paymentStatus}
                        </StatusBadge>
                      )}
                    </div>
                    <TransactionAmount positive={transaction.amount > 0}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </TransactionAmount>
                    <TransactionDate>{formatDate(transaction.createdAt)}</TransactionDate>
                  </TransactionMeta>
                </TransactionHeader>

                <TransactionDetails>
                  <DetailItem>
                    <DetailLabel>Balance Before</DetailLabel>
                    <DetailValue>{transaction.balanceBefore} credits</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Balance After</DetailLabel>
                    <DetailValue>{transaction.balanceAfter} credits</DetailValue>
                  </DetailItem>
                  {transaction.creditPlan && (
                    <DetailItem>
                      <DetailLabel>Credit Plan</DetailLabel>
                      <DetailValue>{transaction.creditPlan.name}</DetailValue>
                    </DetailItem>
                  )}
                  {transaction.creditPlan?.price && (
                    <DetailItem>
                      <DetailLabel>Price</DetailLabel>
                      <DetailValue>{formatPrice(transaction.creditPlan.price)}</DetailValue>
                    </DetailItem>
                  )}
                  {transaction.paymentMethod && (
                    <DetailItem>
                      <DetailLabel>Payment Method</DetailLabel>
                      <DetailValue>{transaction.paymentMethod}</DetailValue>
                    </DetailItem>
                  )}
                  {transaction.paymentReference && (
                    <DetailItem>
                      <DetailLabel>Payment Reference</DetailLabel>
                      <DetailValue>{transaction.paymentReference}</DetailValue>
                    </DetailItem>
                  )}
                </TransactionDetails>

                {transaction.type === 'purchase' && transaction.paymentStatus === 'pending' && (
                  <ActionButtons>
                    <ActionButton onClick={() => handleConfirmPayment(transaction.id, 'completed')}>
                      Approve Payment
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleConfirmPayment(transaction.id, 'failed')}
                    >
                      Reject Payment
                    </ActionButton>
                  </ActionButtons>
                )}
              </TransactionCard>
            ))}
          </TransactionsList>

          <PaginationContainer>
            <PaginationButton
              onClick={handlePrevPage}
              disabled={pagination.offset === 0}
            >
              Previous
            </PaginationButton>
            <PaginationInfo>
              Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </PaginationInfo>
            <PaginationButton
              onClick={handleNextPage}
              disabled={!pagination.hasMore}
            >
              Next
            </PaginationButton>
          </PaginationContainer>
        </>
      ) : (
        <EmptyState>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
          <div>No transactions found</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Transactions will appear here once users start purchasing credits
          </div>
        </EmptyState>
      )}
    </Container>
  )
}

export default Transactions
