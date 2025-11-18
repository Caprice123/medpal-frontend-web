import {
  Grid,
  Card,
  CardHeader,
  IconWrapper,
  StatusBadge,
  FeatureName,
  FeatureDescription,
  CardFooter,
  CostBadge,
  ConfigButton
} from './FeaturesList.styles'

function FeaturesList({ features, onFeatureClick }) {
  return (
    <Grid>
      {features.map((feature) => (
        <Card
          key={feature.id}
          isActive={feature.isActive}
          borderColor={feature.color}
          onClick={() => onFeatureClick(feature)}
        >
          <CardHeader>
            <IconWrapper color={feature.color}>
              {feature.icon}
            </IconWrapper>
            <StatusBadge isActive={feature.isActive}>
              {feature.isActive ? 'Aktif' : 'Nonaktif'}
            </StatusBadge>
          </CardHeader>

          <FeatureName color={feature.color}>
            {feature.name}
          </FeatureName>

          <FeatureDescription>
            {feature.description}
          </FeatureDescription>

          <CardFooter>
            <ConfigButton color={feature.color}>
              Konfigurasi
            </ConfigButton>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  )
}

export default FeaturesList
