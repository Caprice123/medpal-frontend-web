import {
  TableWrapper,
  StyledTable,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
  LoadingState,
  LoadingSpinner,
  LoadingText
} from './Table.styles'

/**
 * Reusable Table component
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions [{ key, header, align, width, render }]
 * @param {Array} props.data - Data array to display
 * @param {boolean} props.striped - Enable striped rows
 * @param {boolean} props.hoverable - Enable hover effect on rows
 * @param {Function} props.onRowClick - Click handler for rows
 * @param {boolean} props.loading - Show loading state
 * @param {string} props.emptyText - Text to show when no data
 * @param {string} props.emptySubtext - Subtext to show when no data
 * @param {string} props.className - Additional CSS class
 */
function Table({
  columns = [],
  data = [],
  striped = false,
  hoverable = true,
  onRowClick,
  loading = false,
  emptyText = 'No data available',
  emptySubtext = 'There are no items to display',
  className = ''
}) {
  // Loading state
  if (loading) {
    return (
      <TableWrapper className={className}>
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading data...</LoadingText>
        </LoadingState>
      </TableWrapper>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <TableWrapper className={className}>
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyText>{emptyText}</EmptyText>
          <EmptySubtext>{emptySubtext}</EmptySubtext>
        </EmptyState>
      </TableWrapper>
    )
  }

  return (
    <TableWrapper className={className}>
      <StyledTable>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableHeader
                key={column.key || index}
                align={column.align}
                width={column.width}
              >
                {column.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody striped={striped}>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              hoverable={hoverable}
              clickable={!!onRowClick}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <TableCell
                  key={column.key || colIndex}
                  align={column.align}
                  width={column.width}
                >
                  {column.render
                    ? column.render(column.key ? row[column.key]: row, rowIndex)
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  )
}

export default Table
