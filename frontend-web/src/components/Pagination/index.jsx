import React from 'react'
import {
  PaginationContainer,
  PaginationButton,
  PageInfo
} from './Pagination.styles'

/**
 * Reusable Pagination Component
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages (optional, if provided will show "Page X of Y")
 * @param {boolean} isLastPage - Whether this is the last page (used when totalPages is not available)
 * @param {function} onPageChange - Callback function when page changes
 * @param {boolean} isLoading - Whether data is currently loading
 * @param {string} variant - Style variant: 'default' or 'admin' (default: 'default')
 * @param {string} language - Language: 'id' or 'en' (default: 'en')
 */
function Pagination({
  currentPage,
  totalPages,
  isLastPage,
  onPageChange,
  isLoading,
  variant = 'default',
  language = 'en'
}) {
  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    const isDisabled = totalPages ? currentPage >= totalPages : isLastPage
    if (!isDisabled && !isLoading) {
      onPageChange(currentPage + 1)
    }
  }

  // Text translations
  const text = {
    id: {
      previous: '← Sebelumnya',
      next: 'Selanjutnya →',
      page: 'Halaman',
      of: 'dari'
    },
    en: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of'
    }
  }

  const t = text[language]

  // Determine if next button should be disabled
  const isNextDisabled = totalPages ? currentPage >= totalPages : (isLastPage || false)

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        $variant={variant}
      >
        {t.previous}
      </PaginationButton>

      <PageInfo>
        {totalPages
          ? `${t.page} ${currentPage} ${t.of} ${totalPages}`
          : `${t.page} ${currentPage}`
        }
      </PageInfo>

      <PaginationButton
        onClick={handleNext}
        disabled={isNextDisabled || isLoading}
        $variant={variant}
      >
        {t.next}
      </PaginationButton>
    </PaginationContainer>
  )
}

export default Pagination
