import { defineStyle, defineStyleConfig } from '@chakra-ui/react'
import { getColor, StyleFunctionProps } from '@chakra-ui/theme-tools'
import { merge } from 'lodash'

import { layerStyles } from '../layerStyles'
import { textStyles } from '../textStyles'
import { getContrastColor } from '../utils'
import { hexToRgba } from '../utils/hexToRgba'

import { Link } from './Link'

export type ThemeButtonColorScheme =
  | 'main'
  | 'success'
  | 'critical'
  | 'inverse'
  | 'sub'

const genVariantSolidColours = ({
  colorScheme: c,
  theme,
}: StyleFunctionProps) => {
  let color = 'base.content.inverse'
  let solidVariantProps

  switch (c) {
    case 'main':
    case 'sub':
    case 'success':
    case 'critical':
    case 'warning':
      {
        solidVariantProps = {
          bg: `interaction.${c}.default`,
          activeBg: `interaction.${c}.active`,
          hoverBg: `interaction.${c}.hover`,
        }
      }
      break
    default: {
      solidVariantProps = {
        bg: `${c}.600`,
        activeBg: `${c}.800`,
        hoverBg: `${c}.700`,
      }
    }
  }
  // Note that using the fallback content colour for the button text could still result in bad contrast.
  color = getContrastColor(
    getColor(theme, color),
    getColor(theme, solidVariantProps.bg),
    'base.content.default',
  )

  return { ...solidVariantProps, color }
}

const genVariantOutlineColours = ({
  colorScheme: c,
  theme,
}: StyleFunctionProps) => {
  switch (c) {
    case 'main':
    case 'critical': {
      return {
        borderColor: `interaction.${c}.default`,
        activeBg: `interaction.tinted.${c}.active`,
        hoverBg: `interaction.tinted.${c}.hover`,
      }
    }
    case 'neutral': {
      return {
        borderColor: 'base.content.strong',
        hoverBg: 'interaction.tinted.neutral.hover',
        activeBg: 'interaction.tinted.neutral.active',
      }
    }
    case 'inverse': {
      return {
        borderColor: 'base.content.inverse',
        hoverBg: 'interaction.tinted.inverse.hover',
        activeBg: 'interaction.tinted.inverse.active',
      }
    }
    case 'sub': {
      return {
        borderColor: `interaction.${c}.default`,
        activeBg: hexToRgba(getColor(theme, 'brand.secondary.500'), 0.12),
        hoverBg: hexToRgba(getColor(theme, 'brand.secondary.500'), 0.04),
      }
    }

    default: {
      return {
        borderColor: `${c}.500` as const,
        activeBg: hexToRgba(getColor(theme, `${c}.500`), 0.12),
        hoverBg: hexToRgba(getColor(theme, `${c}.500`), 0.04),
      }
    }
  }
}

const variantSolid = defineStyle((props) => {
  const { bg, hoverBg, activeBg, color } = genVariantSolidColours(props)

  return {
    bg,
    borderColor: bg,
    color,
    px: '15px',
    _active: {
      bg: activeBg,
      borderColor: activeBg,
    },
    _hover: {
      bg: hoverBg,
      borderColor: hoverBg,
      _disabled: {
        bg: 'interaction.support.disabled',
        borderColor: 'interaction.support.disabled',
      },
    },
  }
})

const genVariantReverseColours = ({ colorScheme: c }: StyleFunctionProps) => {
  switch (c) {
    case 'main':
    case 'sub':
    case 'neutral':
    case 'critical': {
      return {
        activeBg: `interaction.muted.${c}.active`,
        hoverBg: `interaction.muted.${c}.hover`,
        color: `interaction.${c}.default`,
      }
    }

    default: {
      return {
        activeBg: `${c}.100`,
        hoverBg: `${c}.50`,
        color: `${c}.500`,
      }
    }
  }
}

const variantReverse = defineStyle((props) => {
  const { hoverBg, activeBg, color } = genVariantReverseColours(props)

  return {
    bg: 'white',
    borderColor: 'transparent',
    color,
    px: '15px',
    _disabled: {
      bg: 'white',
      borderColor: 'transparent',
    },
    _active: {
      bg: activeBg,
    },
    _hover: {
      bg: hoverBg,
      _disabled: {
        bg: 'white',
      },
    },
  }
})

const variantOutlineClear = defineStyle((props) => {
  const { borderColor, activeBg, hoverBg } = genVariantOutlineColours(props)
  const showBorder = props.variant === 'outline'

  return {
    bg: 'transparent',
    px: '15px',
    borderColor: showBorder ? borderColor : 'transparent',
    color: borderColor,
    _disabled: {
      borderColor: showBorder
        ? 'interaction.support.disabled-content'
        : 'transparent',
      bg: 'transparent',
    },
    _active: {
      bg: activeBg,
      borderColor: showBorder ? borderColor : 'transparent',
    },
    _hover: {
      bg: hoverBg,
      borderColor: showBorder ? borderColor : 'transparent',
      _disabled: {
        borderColor: showBorder
          ? 'interaction.support.disabled-content'
          : 'transparent',
        bg: 'transparent',
      },
    },
  }
})

const variantLink = defineStyle((props) => {
  return merge({}, Link.baseStyle?.(props), Link.variants?.standalone, {
    border: 'none',
    minHeight: 'auto',
    fontWeight: 'normal',
    w: 'fit-content',
    _disabled: {
      bg: 'transparent',
    },
  })
})

const variantInputAttached = defineStyle((props) => {
  const { focusBorderColor: fc, errorBorderColor: ec, theme } = props

  return {
    bg: 'utility.ui',
    color: 'interaction.support.disabled-content',
    borderColor: 'base.divider.strong',
    borderStartRadius: 0,
    borderEndRadius: 'sm',
    _hover: {
      bg: 'interaction.muted.main.hover',
      _disabled: {
        bg: 'interaction.support.disabled',
      },
    },
    outlineOffset: 0,
    _active: {
      color: 'base.content.strong',
      _disabled: {
        color: 'interaction.support.disabled-content',
      },
    },
    _invalid: {
      // Remove extra 1px of outline.
      borderColor: ec,
    },
    _focus: {
      zIndex: 1,
      borderColor: fc,
      boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
    },
    _focusVisible: {
      boxShadow: 'none',
      outline: 'none',
    },
    _disabled: {
      bg: 'interaction.support.disabled',
      borderColor: 'base.divider.strong',
      color: 'interaction.support.disabled-content',
    },
  }
})

const variants = {
  solid: variantSolid,
  reverse: variantReverse,
  outline: variantOutlineClear,
  clear: variantOutlineClear,
  link: variantLink,
  inputAttached: variantInputAttached,
}

const baseStyle = defineStyle({
  ...textStyles['subhead-1'],
  whiteSpace: 'pre-wrap',
  borderRadius: 'base',
  border: '1px solid',
  flexShrink: 0,
  // -1px for border
  px: '15px',
  py: '9px',
  _disabled: {
    bg: 'interaction.support.disabled',
    borderColor: 'interaction.support.disabled',
    opacity: 1,
    color: 'interaction.support.disabled-content',
  },
  ...layerStyles.focusRing.default,
})

const sizes = {
  xs: defineStyle({
    ...textStyles['subhead-2'],
    minH: '2.25rem',
    minW: '2.25rem',
  }),
  sm: defineStyle({
    ...textStyles['subhead-1'],
    minH: '2.5rem',
    minW: '2.5rem',
  }),
  md: defineStyle({
    ...textStyles['subhead-1'],
    minH: '2.75rem',
    minW: '2.75rem',
  }),
  lg: defineStyle({
    ...textStyles['subhead-1'],
    minH: '3rem',
    minW: '3rem',
  }),
}

export const Button = defineStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    variant: 'solid',
    colorScheme: 'main',
    // @ts-expect-error Invalid exported type.
    focusBorderColor: 'utility.focus-default',
    errorBorderColor: 'interaction.critical.default',
    size: 'md',
  },
})
