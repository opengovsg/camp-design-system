/**
 * Custom hook to generate page ranges for any pagination component.
 * Adapted from
 * https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/
 */
import { useMemo } from 'react'

interface UsePaginationRangeProps<T = string> {
  siblingCount: number
  totalCount: number
  pageSize: number
  currentPage: number
  separator: T
}

const range = (start: number, end: number): number[] => {
  const length = end - start
  return Array.from({ length }, (_, i) => start + i)
}

export const usePaginationRange = <T = string>({
  totalCount,
  pageSize,
  siblingCount,
  currentPage,
  separator,
}: UsePaginationRangeProps<T>): (T | number)[] =>
  useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)

    const minGapSize = 2
    const numPageDisplaySlots = 2 * siblingCount + 5

    if (numPageDisplaySlots >= totalPageCount) {
      return range(1, totalPageCount + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    )

    const shouldShowLeftSeparator = leftSiblingIndex - 1 > minGapSize
    const shouldShowRightSeparator =
      totalPageCount - rightSiblingIndex > minGapSize

    if (!shouldShowLeftSeparator && shouldShowRightSeparator) {
      const leftItemCount = numPageDisplaySlots - 2
      const leftRange = range(1, leftItemCount + 1)
      return [...leftRange, separator, totalPageCount]
    }

    if (shouldShowLeftSeparator && !shouldShowRightSeparator) {
      const rightItemCount = numPageDisplaySlots - 2
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount + 1,
      )
      return [1, separator, ...rightRange]
    }

    if (shouldShowLeftSeparator && shouldShowRightSeparator) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex + 1)
      return [1, separator, ...middleRange, separator, totalPageCount]
    }

    return range(1, totalPageCount + 1)
  }, [totalCount, pageSize, siblingCount, currentPage, separator])
