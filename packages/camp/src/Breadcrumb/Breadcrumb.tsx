import { Children, forwardRef, Fragment, isValidElement } from 'react'
import {
  Breadcrumb as ChakraBreadcrumb,
  type BreadcrumbRootProps as ChakraBreadcrumbRootProps,
} from '@chakra-ui/react'

import { BxChevronRight } from '~/icons'
import type { BreadcrumbColorPalette } from '~/theme/slotRecipes/breadcrumb.slotRecipe'

export interface BreadcrumbProps
  extends Omit<ChakraBreadcrumbRootProps, 'colorPalette'> {
  /**
   * Each child should be a `<Breadcrumb.Item>` (the wrapper auto-injects
   * `<Breadcrumb.Separator>` between consecutive items).
   *
   * The legacy v1 `<BreadcrumbItem>` / `<BreadcrumbLink>` exports still work
   * via deprecated re-exports.
   */
  children: React.ReactNode
  /**
   * Separator rendered between items. Defaults to a chevron-right icon.
   * Pass a string (e.g. `'/'`) or any `ReactElement` to override; pass
   * `null` to render no separator.
   */
  separator?: React.ReactNode
  colorPalette?:
    | ChakraBreadcrumbRootProps['colorPalette']
    | BreadcrumbColorPalette
}

/**
 * Convenience wrapper around v3's `Breadcrumb` compound. Auto-builds the
 * `Breadcrumb.Root` / `Breadcrumb.List` scaffold and interleaves
 * `Breadcrumb.Separator` nodes between consumer-provided items — preserving
 * v1's `<Breadcrumb separator="/">` ergonomics.
 *
 * For full slot composition (mixing separators per item, conditional
 * `Ellipsis`, etc.) use the compound API directly:
 *
 * ```tsx
 * <Breadcrumb.Root>
 *   <Breadcrumb.List>
 *     <Breadcrumb.Item>...</Breadcrumb.Item>
 *     <Breadcrumb.Separator><BxChevronRight /></Breadcrumb.Separator>
 *     <Breadcrumb.Item>...</Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb.Root>
 * ```
 */
const BreadcrumbInner = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ children, separator = <BxChevronRight />, ...rootProps }, ref) => {
    const items = Children.toArray(children).filter(isValidElement)

    return (
      <ChakraBreadcrumb.Root ref={ref} {...rootProps}>
        <ChakraBreadcrumb.List>
          {items.map((item, index) => (
            <Fragment key={index}>
              {item}
              {separator !== null && index < items.length - 1 ? (
                <ChakraBreadcrumb.Separator>
                  {separator}
                </ChakraBreadcrumb.Separator>
              ) : null}
            </Fragment>
          ))}
        </ChakraBreadcrumb.List>
      </ChakraBreadcrumb.Root>
    )
  },
)
BreadcrumbInner.displayName = 'Breadcrumb'

// Attach all v3 sub-components to the wrapper namespace so consumers can
// reach for `Breadcrumb.Item`, `Breadcrumb.Link`, etc. without a separate
// import. v3's namespace itself is frozen — spread (Avatar / Tag precedent).
export const Breadcrumb: typeof BreadcrumbInner & typeof ChakraBreadcrumb =
  Object.assign(BreadcrumbInner, { ...ChakraBreadcrumb })

// --- Deprecated v1 aliases ---------------------------------------------------

/** @deprecated Use `Breadcrumb.Item` instead. */
export const BreadcrumbItem = ChakraBreadcrumb.Item
/** @deprecated Use `Breadcrumb.Link` instead. */
export const BreadcrumbLink = ChakraBreadcrumb.Link

export type {
  BreadcrumbCurrentLinkProps,
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbRootProps,
  BreadcrumbSeparatorProps,
} from '@chakra-ui/react'

export type { BreadcrumbColorPalette }
