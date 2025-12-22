import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, cssVar } from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

const parts = menuAnatomy.extend('chevron')

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const $bg = cssVar('menu-bg')
const $shadow = cssVar('menu-shadow')
const disabledItemStyles = {
  color: 'interaction.support.disabled-content',
  opacity: 1,
  cursor: 'not-allowed',
}

const getListItemColors = ({ colorScheme: c }: StyleFunctionProps) => {
  switch (c) {
    case 'main': {
      return {
        hoverBg: 'interaction.muted.main.hover',
        activeBg: 'interaction.muted.main.active',
      }
    }
    default: {
      return {
        hoverBg: `${c}.100`,
        activeBg: `${c}.200`,
      }
    }
  }
}

const baseStyle = definePartsStyle((props) => {
  const { hoverBg, activeBg } = getListItemColors(props)

  return {
    button: {
      textAlign: 'left',
      justifyContent: 'space-between',
    },
    list: {
      mt: '0.5rem',
      border: 'none',
      borderRadius: 0,
      minWidth: '0rem',
      [$shadow.variable]: 'shadows.sm',
      [$bg.variable]: 'colors.utility.ui',
      boxShadow: $shadow.reference,
    },
    item: {
      // Required for items to also have variable colors
      bg: $bg.reference,
      [$bg.variable]: 'colors.utility.ui',
      textStyle: 'body-1',
      fontWeight: '400',
      color: 'base.content.strong',
      _hover: {
        [$bg.variable]: `colors.${hoverBg}`,
      },
      _disabled: disabledItemStyles,
      '&[aria-disabled=true], &[data-disabled]': {
        ...disabledItemStyles,
        _hover: {
          [$bg.variable]: 'colors.utility.ui',
        },
        _active: {
          [$bg.variable]: 'colors.utility.ui',
        },
      },
      _focus: {
        [$bg.variable]: `colors.${hoverBg}`,
        _active: {
          [$bg.variable]: `colors.${activeBg}`,
        },
      },
      _focusVisible: {
        boxShadow: `0 0 0 2px var(--chakra-colors-utility-focus-default)`,
        _active: {
          [$bg.variable]: `colors.${activeBg}`,
        },
      },
      _active: {
        [$bg.variable]: `colors.${activeBg}`,
      },
    },
    divider: {
      borderColor: 'base.divider.medium',
      opacity: 1,
      my: 0,
    },
  }
})

const getClearButtonColors = ({ colorScheme: c }: StyleFunctionProps) => {
  switch (c) {
    case 'main':
    case 'sub':
    case 'success':
    case 'critical':
    case 'warning': {
      return {
        color: `interaction.${c}.default`,
        hoverColor: `interaction.${c}.hover`,
        activeColor: `interaction.${c}.active`,
      }
    }
    default: {
      return {
        color: `${c}.500`,
        hoverColor: `${c}.600`,
        activeColor: `${c}.700`,
      }
    }
  }
}

const variantClear = definePartsStyle((props) => {
  const { color, hoverColor, activeColor } = getClearButtonColors(props)
  return {
    button: {
      bg: 'transparent',
      color,
      _hover: {
        color: hoverColor,
      },
      _active: {
        color: activeColor,
      },
    },
  }
})

const variants = {
  clear: variantClear,
  outline: {},
}

const sizes = {
  sm: definePartsStyle({
    chevron: {
      fontSize: '1.25rem',
    },
    item: {
      textStyle: 'subhead-2',
      padding: '0.625rem 0.75rem',
    },
  }),
  md: definePartsStyle({
    chevron: {
      fontSize: '1.25rem',
    },
    item: {
      textStyle: 'body-1',
      padding: '0.75rem 1rem',
    },
  }),
}

export const Menu = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    colorScheme: 'main',
    variant: 'outline',
    size: 'md',
  },
})
