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
   * Renders the link as non-interactive while preserving the styled
   * appearance. The link cannot be clicked or focused.
   */
  disabled?: boolean
  /**
   * Element appended after the link contents when `external` is true.
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
