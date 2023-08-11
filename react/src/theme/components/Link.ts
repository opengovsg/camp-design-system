import { defineStyle, defineStyleConfig } from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

import { layerStyles } from '../layerStyles'

const getLinkColors = ({ colorScheme: c }: StyleFunctionProps) => {
  switch (c) {
    case 'main':
      return {
        color: 'interaction.links.default',
        hoverColor: 'interaction.links.hover',
      }
    case 'neutral':
      return {
        color: 'interaction.links.neutral-default',
        hoverColor: 'interaction.links.neutral-hover',
      }
    case 'inverse':
      return {
        color: 'interaction.links.inverse-default',
        hoverColor: 'interaction.links.inverse-hover',
      }
    // Special cases for accessibility.
    case 'success':
      return {
        color: `${c}.700`,
        hoverColor: `${c}.800`,
      }
    case 'warning':
      return {
        color: `${c}.800`,
        hoverColor: `${c}.900`,
      }
    default:
      return {
        color: `${c}.500`,
        hoverColor: `${c}.600`,
      }
  }
}

const baseStyle = defineStyle((props) => {
  const { color, hoverColor } = getLinkColors(props)

  return {
    outlineOffset: 0,
    height: 'fit-content',
    width: 'fit-content',
    position: 'relative',
    textUnderlineOffset: '0.125rem',
    color,
    _dark: {
      color: 'interaction.links.inverse-default',
      _hover: {
        color: 'interaction.links.inverse-hover',
      },
    },
    borderRadius: 'base',
    _hover: {
      color: hoverColor,
      _disabled: {
        color: 'interaction.support.disabled-content',
      },
    },
    _disabled: {
      color: 'interaction.support.disabled-content',
      cursor: 'not-allowed',
    },
    _focusVisible: {
      ...layerStyles.focusRing.default._focusVisible,
      outlineOffset: 0,
    },
  }
})

const variantInline = defineStyle({
  textDecorationLine: 'underline',
})

const getVariantStandaloneTextStyle = ({ size }: StyleFunctionProps) => {
  switch (size) {
    case 'xs':
      return 'caption-1'
    case 'sm':
      return 'subhead-2'
    case 'md':
      return 'subhead-1'
  }
}

const variantStandalone = defineStyle((props) => ({
  p: '0.25rem',
  _hover: {
    textDecorationLine: 'underline',
  },
  textStyle: getVariantStandaloneTextStyle(props),
}))

const variants = {
  inline: variantInline,
  standalone: variantStandalone,
}

export const Link = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'inline',
    colorScheme: 'main',
    size: 'md',
  },
})
