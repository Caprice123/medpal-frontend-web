import {
  CardContainer,
  CardHeaderContainer,
  CardTitle,
  CardActions,
  CardBodyContainer,
  CardFooterContainer
} from './Card.styles'

// Main Card Component
export const Card = ({
  children,
  variant = 'default',
  rounded = 'md',
  shadow = true,
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) => {
  return (
    <CardContainer
      variant={variant}
      rounded={rounded}
      shadow={shadow}
      hoverable={hoverable}
      clickable={clickable}
      onClick={onClick}
      {...props}
    >
      {children}
    </CardContainer>
  )
}

// Card Header Component
export const CardHeader = ({
  children,
  title,
  actions,
  size = 'md',
  color,
  padding,
  divider = true,
  background,
  ...props
}) => {
  return (
    <CardHeaderContainer
      padding={padding}
      divider={divider}
      background={background}
      {...props}
    >
      {title && (
        <CardTitle size={size} color={color}>
          {title}
        </CardTitle>
      )}
      {!title && children}
      {actions && <CardActions>{actions}</CardActions>}
    </CardHeaderContainer>
  )
}

// Card Body Component
export const CardBody = ({
  children,
  padding,
  ...props
}) => {
  return (
    <CardBodyContainer padding={padding} {...props}>
      {children}
    </CardBodyContainer>
  )
}

// Card Footer Component
export const CardFooter = ({
  children,
  align = 'right',
  padding,
  divider = true,
  background,
  ...props
}) => {
  return (
    <CardFooterContainer
      align={align}
      padding={padding}
      divider={divider}
      background={background}
      {...props}
    >
      {children}
    </CardFooterContainer>
  )
}

// Default export
export default Card
