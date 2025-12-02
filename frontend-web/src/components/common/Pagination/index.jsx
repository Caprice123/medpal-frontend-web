import {
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PageButton,
  PageEllipsis
} from './Pagination.styles'

/**
 * Reusable Pagination component
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Items per page
 * @param {Function} props.onPageChange - Page change callback
 * @param {number} props.maxPageButtons - Maximum page buttons to show (default: 5)
 * @param {string} props.className - Additional CSS class
 */
function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  maxPageButtons = 5,
  className = ''
}) {
  // Calculate range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const halfMax = Math.floor(maxPageButtons / 2)

    let startPage = Math.max(1, currentPage - halfMax)
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    // Adjust start if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const handlePageClick = (page) => {
    if (page !== currentPage && onPageChange) {
      onPageChange(page)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <PaginationContainer className={className}>
      <PaginationInfo>
        Showing {startItem} to {endItem} of {totalItems} results
      </PaginationInfo>

      <PaginationControls>
        <PageButton
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ‹
        </PageButton>

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return <PageEllipsis key={`ellipsis-${index}`}>...</PageEllipsis>
          }

          return (
            <PageButton
              key={page}
              active={page === currentPage}
              onClick={() => handlePageClick(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          )
        })}

        <PageButton
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </PageButton>
      </PaginationControls>
    </PaginationContainer>
  )
}

export default Pagination
