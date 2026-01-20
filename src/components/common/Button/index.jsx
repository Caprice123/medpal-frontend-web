import { StyledButton } from './Button.styles'

/**
 * Reusable Button component
 *
 * @param {Object} props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'danger', 'success', 'outline'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {boolean} props.disabled - Disable the button
 * @param {boolean} props.fullWidth - Make button full width
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS class
 */
function Button({
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      className={className}
      {...rest}
    >
      {children}
    </StyledButton>
  )
}

export default Button
