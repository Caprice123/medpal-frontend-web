import PlanCard from '../PlanCard'
import { Grid, EmptyState } from './PlansList.styles'

function PlansList({ plans, onEdit, onToggle, onDelete, formatPrice }) {
  // Ensure plans is always an array
  const plansList = Array.isArray(plans) ? plans : []

  if (plansList.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <div>No pricing plans found</div>
        <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Click "Add New Plan" to create your first pricing plan
        </div>
      </EmptyState>
    )
  }

  return (
    <Grid>
      {plansList.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          formatPrice={formatPrice}
        />
      ))}
    </Grid>
  )
}

export default PlansList
