import { useBreakpointValue } from '@chakra-ui/react'

import { PaginationFull } from './PaginationFull'
import { PaginationMinimal } from './PaginationMinimal'

export type PaginationVariant = 'full' | 'minimal'

export interface PaginationProps {
  /**
   * Number of pages to display to the left and right of the current page.
   * @default 1
   */
  siblingCount?: number
  /** Total number of elements to paginate. */
  totalCount: number
  /** Size of each page; determines the number of rendered page counts. */
  pageSize: number
  /** Called with the new page (1-based) when the user clicks a page button. */
  onPageChange: (page: number) => void
  /** The currently active page (1-based). */
  currentPage: number
  /** Whether the pagination buttons are disabled. */
  isDisabled?: boolean
  /**
   * Which variant to render. Accepts a responsive object to switch between
   * `full` (desktop) and `minimal` (mobile) at runtime. Defaults to `full`.
   */
  variant?:
    | PaginationVariant
    | { base: PaginationVariant; md?: PaginationVariant }
}

export const Pagination = ({
  variant: variantProp = 'full',
  ...props
}: PaginationProps): JSX.Element => {
  const variant = useBreakpointValue(
    typeof variantProp === 'string' ? { base: variantProp } : variantProp,
  )

  return variant === 'minimal' ? (
    <PaginationMinimal {...props} />
  ) : (
    <PaginationFull {...props} />
  )
}
