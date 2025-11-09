import PlanCard from '../PlanCard'
import { Grid, EmptyState } from './PlansList.styles'

function PlansList({ plans, onEdit, onToggle, onDelete, formatPrice }) {
  if (plans.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <div>No credit plans created yet</div>
        <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Click "Add New Plan" to create your first credit plan
        </div>
      </EmptyState>
    )
  }

  return (
    <Grid>
      {plans.map((plan) => (
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
