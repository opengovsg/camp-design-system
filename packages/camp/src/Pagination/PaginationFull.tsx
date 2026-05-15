import { useCallback, useMemo } from 'react'
import { chakra, useSlotRecipe } from '@chakra-ui/react'

import { BxChevronLeft, BxChevronRight } from '~/icons'

import type { PaginationProps } from './Pagination'
import { usePaginationRange } from './usePaginationRange'

const SEPARATOR = '…'

interface FullPageButtonProps {
  selectedPage: PaginationProps['currentPage']
  page: number | typeof SEPARATOR
  onClick: PaginationProps['onPageChange']
  isDisabled: PaginationProps['isDisabled']
  styles: ReturnType<ReturnType<typeof useSlotRecipe>>
}

const FullPageButton = ({
  selectedPage,
  page,
  onClick,
  isDisabled,
  styles,
}: FullPageButtonProps) => {
  const isSelected = page === selectedPage

  const handleClick = useCallback(() => {
    if (page === SEPARATOR) return
    onClick(page)
  }, [onClick, page])

  if (page === SEPARATOR) {
    return (
      <chakra.li aria-disabled={isDisabled} css={styles.separator}>
        {page}
      </chakra.li>
    )
  }

  return (
    <chakra.li>
      <chakra.button
        type="button"
        aria-current={isSelected ? 'page' : 'false'}
        css={styles.button}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {page}
      </chakra.button>
    </chakra.li>
  )
}

export const PaginationFull = ({
  siblingCount = 1,
  pageSize,
  onPageChange,
  totalCount,
  currentPage,
  isDisabled,
}: PaginationProps) => {
  const paginationRange = usePaginationRange<typeof SEPARATOR>({
    totalCount,
    pageSize,
    currentPage,
    siblingCount,
    separator: SEPARATOR,
  })

  const recipe = useSlotRecipe({ key: 'pagination' })
  const styles = useMemo(() => recipe({ variant: 'full' }), [recipe])

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
    <chakra.nav aria-label="Pagination">
      <chakra.ul
        display="flex"
        flexFlow="row nowrap"
        listStyleType="none"
        alignItems="center"
        gap="2px"
      >
        <chakra.li>
          <chakra.button
            type="button"
            css={styles.stepper}
            aria-label="Previous page"
            disabled={isDisablePrevPage}
            onClick={handlePageBack}
          >
            <BxChevronLeft />
          </chakra.button>
        </chakra.li>
        {paginationRange.map((p, i) => (
          <FullPageButton
            key={i}
            page={p}
            isDisabled={isDisabled}
            selectedPage={currentPage}
            onClick={onPageChange}
            styles={styles}
          />
        ))}
        <chakra.li>
          <chakra.button
            type="button"
            css={styles.stepper}
            aria-label="Next page"
            disabled={isDisableNextPage}
            onClick={handlePageNext}
          >
            <BxChevronRight />
          </chakra.button>
        </chakra.li>
      </chakra.ul>
    </chakra.nav>
  )
}
