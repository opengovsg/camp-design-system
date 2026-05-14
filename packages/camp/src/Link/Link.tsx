import { forwardRef, type ReactElement } from 'react'
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from '@chakra-ui/react'

import { BxLinkExternal } from '~/icons'
import type { LinkColorPalette } from '~/theme/recipes/link.recipe'

const ExternalIcon = () => (
  <BxLinkExternal ml="0.25rem" fontSize="1em" aria-hidden />
)

export interface LinkProps extends Omit<ChakraLinkProps, 'colorPalette'> {
  /**
   * Renders the link as non-interactive (no navigation, no focus, no hover)
   * while preserving the recipe's styled appearance. Matches v1 behaviour:
   * the link is visually disabled (muted colour, not-allowed cursor) AND
   * cannot be clicked or focused.
   */
  disabled?: boolean
  /**
   * Element appended to the link contents when `external` is true.
   * Defaults to `<Link.ExternalIcon />`.
   */
  externalIcon?: ReactElement
  /** Marks the link as opening an external destination; appends an icon. */
  external?: boolean
  colorPalette?: ChakraLinkProps['colorPalette'] | LinkColorPalette
}

const LinkInner = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      disabled,
      external,
      externalIcon = <ExternalIcon />,
      colorPalette = 'main',
      href,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <ChakraLink
        ref={ref}
        colorPalette={colorPalette}
        display="inline-flex"
        alignItems="center"
        // When disabled, strip the href so it can't be navigated, kill
        // pointer events + focus, and surface the recipe's _disabled state
        // via the data-disabled attribute (which v3 maps to the `_disabled`
        // pseudo). This preserves v1's "fully non-interactive but styled"
        // intent without rendering as a separately-styled Text element.
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        pointerEvents={disabled ? 'none' : undefined}
        {...props}
      >
        {children}
        {external && externalIcon}
      </ChakraLink>
    )
  },
)
LinkInner.displayName = 'Link'

export const Link = Object.assign(LinkInner, { ExternalIcon })
