import {
  Card,
  PopularBadge,
  CardHeader,
  IconWrapper,
  PlanName,
  PlanDescription,
  StatsContainer,
  PlanCredits,
  CreditsLabel,
  PriceContainer,
  PlanPrice,
  PricePerCredit,
  DiscountBadge,
  ActionButtons,
  ActionButton
} from './PlanCard.styles'

const planIcons = {
  'basic': '📋',
  'starter': '🚀',
  'standard': '⭐',
  'premium': '💎',
  'professional': '👑',
  'enterprise': '🏆'
}

function PlanCard({ plan, onEdit, onToggle, formatPrice }) {
  const getPlanIcon = () => {
    const planNameLower = plan.name.toLowerCase()
    for (const [key, icon] of Object.entries(planIcons)) {
      if (planNameLower.includes(key)) {
        return icon
      }
    }
    return '💳'
  }

  const pricePerCredit = (plan.price / plan.credits).toFixed(0)

  return (
    <Card isActive={plan.isActive}>
      {plan.isPopular && <PopularBadge>POPULAR</PopularBadge>}

      <CardHeader>
        <IconWrapper>{getPlanIcon()}</IconWrapper>
        <PlanName>{plan.name}</PlanName>
      </CardHeader>

      {plan.description && <PlanDescription>{plan.description}</PlanDescription>}

      <StatsContainer>
        <PlanCredits>{plan.credits.toLocaleString()}</PlanCredits>
        <CreditsLabel>Credits</CreditsLabel>

        <PriceContainer>
          <PlanPrice>
            {formatPrice(plan.price)} <span>IDR</span>
          </PlanPrice>
          <PricePerCredit>
            {formatPrice(pricePerCredit)}/credit
          </PricePerCredit>
        </PriceContainer>
      </StatsContainer>

      {plan.discount > 0 && (
        <DiscountBadge>{plan.discount}% OFF</DiscountBadge>
      )}

      <ActionButtons>
        <ActionButton onClick={() => onEdit(plan)}>
          Edit
        </ActionButton>
        <ActionButton
          variant="warning"
          onClick={() => onToggle(plan)}
        >
          {plan.isActive ? 'Disable' : 'Enable'}
        </ActionButton>
      </ActionButtons>
    </Card>
  )
}

export default PlanCard
