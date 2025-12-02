import { Container as StyledContainer, Row as StyledRow, Col as StyledCol } from './Grid.styles'

/**
 * Bootstrap-like Container component
 *
 * @param {Object} props
 * @param {boolean} props.fluid - Full width container
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Inline styles
 *
 * @example
 * <Container>...</Container>
 * <Container fluid>...</Container>
 */
export function Container({ fluid = false, children, className = '', style }) {
  return (
    <StyledContainer fluid={fluid} className={className} style={style}>
      {children}
    </StyledContainer>
  )
}

/**
 * Bootstrap-like Row component
 *
 * @param {Object} props
 * @param {boolean} props.noGutters - Remove gutters between columns
 * @param {string} props.gap - Custom gap between columns (e.g., '1rem', '20px')
 * @param {string} props.alignItems - Align items (flex-start, center, flex-end, stretch, baseline)
 * @param {string} props.justifyContent - Justify content (flex-start, center, flex-end, space-between, space-around, space-evenly)
 * @param {React.ReactNode} props.children - Row content
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Inline styles
 *
 * @example
 * <Row>...</Row>
 * <Row gap="1rem">...</Row>
 * <Row alignItems="center" justifyContent="space-between">...</Row>
 * <Row style={{ marginTop: '1rem' }}>...</Row>
 */
export function Row({
  noGutters = false,
  gap,
  alignItems,
  justifyContent,
  children,
  className = '',
  style
}) {
  return (
    <StyledRow
      noGutters={noGutters}
      gap={gap}
      alignItems={alignItems}
      justifyContent={justifyContent}
      className={className}
      style={style}
    >
      {children}
    </StyledRow>
  )
}

/**
 * Bootstrap-like Col component with 12-column grid system
 *
 * @param {Object} props
 * @param {number|string} props.col - Default column size (1-12 or 'auto')
 * @param {number|string} props.xs - Column size for extra small devices (1-12 or 'auto')
 * @param {number|string} props.sm - Column size for small devices (1-12 or 'auto')
 * @param {number|string} props.md - Column size for medium devices (1-12 or 'auto')
 * @param {number|string} props.lg - Column size for large devices (1-12 or 'auto')
 * @param {number|string} props.xl - Column size for extra large devices (1-12 or 'auto')
 * @param {number|string} props.xxl - Column size for extra extra large devices (1-12 or 'auto')
 * @param {number} props.offset - Offset columns from left (1-11)
 * @param {number} props.order - Flex order
 * @param {string} props.alignSelf - Align self (flex-start, center, flex-end, stretch, baseline)
 * @param {React.ReactNode} props.children - Column content
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Inline styles
 *
 * @example
 * <Col xs={12} md={6} lg={4}>...</Col>
 * <Col xs="auto">...</Col>
 * <Col xs={12} md={6} offset={3}>...</Col>
 * <Col xs={12} md={6} order={2}>...</Col>
 */
export function Col({
  col,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  offset,
  order,
  alignSelf,
  children,
  className = '',
  style
}) {
  return (
    <StyledCol
      col={col}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      xxl={xxl}
      offset={offset}
      order={order}
      alignSelf={alignSelf}
      className={className}
      style={style}
    >
      {children}
    </StyledCol>
  )
}

export default { Container, Row, Col }
