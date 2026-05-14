import { forwardRef, type ReactElement, type Ref } from 'react'
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
  Text,
  type TextProps,
} from '@chakra-ui/react'

import { BxLinkExternal } from '~/icons'
import type { LinkColorPalette } from '~/theme/recipes/link.recipe'

const ExternalIcon = () => (
  <BxLinkExternal ml="0.25rem" fontSize="1em" aria-hidden />
)

export interface LinkProps extends Omit<ChakraLinkProps, 'colorPalette'> {
  /**
   * Renders as a non-interactive `<Text as="a" aria-disabled>` when true.
   * Preserves v1's design choice that disabled links should be fully
   * non-interactive (not just visually muted).
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
      children,
      ...props
    },
    ref,
  ) => {
    if (disabled) {
      // Chakra's `Text` is typed for `HTMLParagraphElement`; v3 doesn't narrow
      // the ref/event-handler types when `as="a"` is used. Cast the props as
      // `TextProps` so the spread is accepted — at runtime the rendered element
      // is `<a>`, and the consumer's anchor-typed event handlers fire on it as
      // expected. Preserves v1's design choice of a fully non-interactive
      // disabled link.
      return (
        <Text
          as="a"
          ref={ref as Ref<HTMLParagraphElement>}
          aria-disabled
          alignItems="center"
          {...(props as TextProps)}
        >
          {children}
          {external && externalIcon}
        </Text>
      )
    }
    return (
      <ChakraLink
        ref={ref}
        colorPalette={colorPalette}
        display="inline-flex"
        alignItems="center"
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
