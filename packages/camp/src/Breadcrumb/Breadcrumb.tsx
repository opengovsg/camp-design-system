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
   * Each child should be a `<Breadcrumb.Item>`. Separators are auto-inserted
   * between consecutive items.
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
 * Wrapper around the Chakra `Breadcrumb` compound. Builds the
 * `Breadcrumb.Root` / `Breadcrumb.List` scaffold and interleaves
 * `Breadcrumb.Separator` nodes between children, so consumers can write:
 *
 * ```tsx
 * <Breadcrumb separator="/">
 *   <Breadcrumb.Item>…</Breadcrumb.Item>
 *   <Breadcrumb.Item>…</Breadcrumb.Item>
 * </Breadcrumb>
 * ```
 *
 * For per-item separator control, use the compound API directly.
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

export const Breadcrumb: typeof BreadcrumbInner & typeof ChakraBreadcrumb =
  Object.assign(BreadcrumbInner, { ...ChakraBreadcrumb })

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
