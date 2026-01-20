# Grid System

A Bootstrap-like responsive grid system with Container, Row, and Col components.

## Features

- ✅ 12-column grid system
- ✅ Responsive breakpoints (xs, sm, md, lg, xl, xxl)
- ✅ Flexbox-based layout
- ✅ Auto-width columns
- ✅ Column offset and ordering
- ✅ Custom gaps between columns
- ✅ Alignment options
- ✅ Nested grids support

## Breakpoints

| Breakpoint | Size    | Device           |
|------------|---------|------------------|
| xs         | <576px  | Extra small      |
| sm         | ≥576px  | Small            |
| md         | ≥768px  | Medium (tablets) |
| lg         | ≥992px  | Large (desktops) |
| xl         | ≥1200px | Extra large      |
| xxl        | ≥1400px | Extra extra large|

## Basic Usage

```jsx
import { Container, Row, Col } from '@components/common/Grid'

function MyComponent() {
  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          First column
        </Col>
        <Col xs={12} md={6}>
          Second column
        </Col>
      </Row>
    </Container>
  )
}
```

## Container

Container centers and constrains content width.

### Props

- `fluid` (boolean): Full-width container
- `className` (string): Additional CSS class

### Examples

```jsx
// Standard container (responsive max-width)
<Container>
  Content here
</Container>

// Fluid container (full width)
<Container fluid>
  Full width content
</Container>
```

## Row

Row creates a horizontal group of columns.

### Props

- `noGutters` (boolean): Remove spacing between columns
- `gap` (string): Custom gap (e.g., '1rem', '20px')
- `alignItems` (string): Vertical alignment (flex-start, center, flex-end, stretch, baseline)
- `justifyContent` (string): Horizontal alignment (flex-start, center, flex-end, space-between, space-around, space-evenly)
- `className` (string): Additional CSS class

### Examples

```jsx
// Basic row
<Row>
  <Col>...</Col>
</Row>

// Custom gap
<Row gap="2rem">
  <Col>...</Col>
</Row>

// Center items vertically
<Row alignItems="center">
  <Col>...</Col>
</Row>

// Space items evenly
<Row justifyContent="space-between">
  <Col>...</Col>
</Row>

// No gutters
<Row noGutters>
  <Col>...</Col>
</Row>
```

## Col

Column component with responsive sizing.

### Props

- `col` (number|string): Default column size (1-12 or 'auto')
- `xs` (number|string): Extra small devices (1-12 or 'auto')
- `sm` (number|string): Small devices (1-12 or 'auto')
- `md` (number|string): Medium devices (1-12 or 'auto')
- `lg` (number|string): Large devices (1-12 or 'auto')
- `xl` (number|string): Extra large devices (1-12 or 'auto')
- `xxl` (number|string): Extra extra large devices (1-12 or 'auto')
- `offset` (number): Offset columns from left (1-11)
- `order` (number): Flex order
- `alignSelf` (string): Align self (flex-start, center, flex-end, stretch, baseline)
- `className` (string): Additional CSS class

### Examples

```jsx
// Equal width columns
<Row>
  <Col>Equal</Col>
  <Col>Equal</Col>
  <Col>Equal</Col>
</Row>

// Specific widths (12-column grid)
<Row>
  <Col xs={8}>8/12 width</Col>
  <Col xs={4}>4/12 width</Col>
</Row>

// Responsive columns
<Row>
  <Col xs={12} md={6} lg={4}>
    Full width on mobile
    Half width on tablet
    One-third width on desktop
  </Col>
</Row>

// Auto-width columns
<Row>
  <Col xs="auto">Fits content</Col>
  <Col>Fills remaining space</Col>
</Row>

// Column offset
<Row>
  <Col xs={4}>Column</Col>
  <Col xs={4} offset={4}>Offset by 4</Col>
</Row>

// Column ordering
<Row>
  <Col order={2}>Second</Col>
  <Col order={1}>First</Col>
  <Col order={3}>Third</Col>
</Row>
```

## Common Patterns

### Two-Column Layout

```jsx
<Container>
  <Row>
    <Col xs={12} md={8}>
      Main content
    </Col>
    <Col xs={12} md={4}>
      Sidebar
    </Col>
  </Row>
</Container>
```

### Three-Column Cards

```jsx
<Container>
  <Row gap="1.5rem">
    <Col xs={12} sm={6} lg={4}>
      <Card />
    </Col>
    <Col xs={12} sm={6} lg={4}>
      <Card />
    </Col>
    <Col xs={12} sm={6} lg={4}>
      <Card />
    </Col>
  </Row>
</Container>
```

### Form Layout

```jsx
<Container>
  <Row gap="1rem">
    <Col xs={12} md={6}>
      <TextInput label="First Name" />
    </Col>
    <Col xs={12} md={6}>
      <TextInput label="Last Name" />
    </Col>
    <Col xs={12}>
      <TextInput label="Email" />
    </Col>
    <Col xs={12} md={4}>
      <TextInput label="City" />
    </Col>
    <Col xs={12} md={4}>
      <TextInput label="State" />
    </Col>
    <Col xs={12} md={4}>
      <TextInput label="Zip" />
    </Col>
  </Row>
</Container>
```

### Centered Content

```jsx
<Container>
  <Row justifyContent="center">
    <Col xs={12} md={8} lg={6}>
      Centered content with max width
    </Col>
  </Row>
</Container>
```

### Nested Grids

```jsx
<Container>
  <Row>
    <Col xs={12} lg={8}>
      <h2>Main Area</h2>
      <Row gap="1rem">
        <Col xs={6}>Nested 1</Col>
        <Col xs={6}>Nested 2</Col>
      </Row>
    </Col>
    <Col xs={12} lg={4}>
      <h2>Sidebar</h2>
    </Col>
  </Row>
</Container>
```

## Tips

1. **Mobile First**: Design for mobile screens first, then add breakpoints for larger screens
2. **Total 12**: Column numbers in a row should add up to 12 for full width
3. **Use Gap**: Prefer `gap` prop over `noGutters` for custom spacing
4. **Auto Width**: Use `xs="auto"` for columns that should fit their content
5. **Offset for Centering**: Use offset to center single columns: `<Col xs={6} offset={3}>`

## See Also

- Check `Grid.examples.jsx` for more comprehensive examples
- All components are mobile-friendly with 44px+ touch targets
- Components follow the blue-green theme (#6BB9E8 to #8DC63F)
