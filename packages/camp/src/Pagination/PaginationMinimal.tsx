import { useCallback, useMemo } from 'react'
import { Box, chakra, Text, useSlotRecipe } from '@chakra-ui/react'

import { BxChevronLeft, BxChevronRight } from '~/icons'

import type { PaginationProps } from './Pagination'

type PaginationMobileProps = Omit<PaginationProps, 'siblingCount'>

export const PaginationMinimal = ({
  pageSize,
  onPageChange,
  totalCount,
  currentPage,
  isDisabled,
}: PaginationMobileProps) => {
  const recipe = useSlotRecipe({ key: 'pagination' })
  const styles = useMemo(() => recipe({ variant: 'minimal' }), [recipe])

  const totalPageCount = Math.ceil(totalCount / pageSize)
  const isDisableNextPage = isDisabled || currentPage >= totalPageCount
  const isDisablePrevPage = isDisabled || currentPage <= 1

  const handlePageBack = useCallback(() => {
    if (isDisablePrevPage) return
    onPageChange(currentPage - 1)
  }, [currentPage, isDisablePrevPage, onPageChange])

  const handlePageNext = useCallback(() => {
    if (isDisableNextPage) return
    onPageChange(currentPage + 1)
  }, [currentPage, isDisableNextPage, onPageChange])

  return (
    <Box css={styles.container}>
      <chakra.button
        type="button"
        css={styles.stepper}
        aria-label="Previous page"
        disabled={isDisablePrevPage}
        onClick={handlePageBack}
      >
        <BxChevronLeft />
      </chakra.button>
      <Text css={styles.text} aria-disabled={isDisabled}>
        Page {currentPage} of {totalPageCount}
      </Text>
      <chakra.button
        type="button"
        css={styles.stepper}
        aria-label="Next page"
        disabled={isDisableNextPage}
        onClick={handlePageNext}
      >
        <BxChevronRight />
      </chakra.button>
    </Box>
  )
}
