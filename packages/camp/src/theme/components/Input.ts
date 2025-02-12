import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { getColor } from '@chakra-ui/theme-tools'
import { memoizedGet as get } from '@chakra-ui/utils'

// Additional success part.
const parts = inputAnatomy.extend('success')

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const outlineVariant = definePartsStyle((props) => {
  const {
    theme,
    focusBorderColor: fc = 'utility.focus-default',
    errorBorderColor: ec = 'interaction.critical.default',
  } = props
  const isPrefilled = props['data-is-prefilled']
  const isSuccess = props['data-is-success']

  return {
    addon: {
      borderRadius: 'base',
    },
    field: {
      borderRadius: 'base',
      bg: isPrefilled ? 'utility.input-prefilled' : 'utility.ui',
      border: '1px solid',
      borderColor: isSuccess
        ? 'interaction.success.default'
        : 'base.divider.strong',
      _placeholder: {
        color: 'interaction.support.placeholder',
      },
      _hover: {
        borderColor: isSuccess
          ? 'interaction.success.default'
          : 'base.divider.strong',
      },
      // Explicit styling here for other components that use a mock input.
      _invalid: {
        borderColor: getColor(theme, ec),
        // Remove extra 1px of outline.
        boxShadow: 'none',
      },
      _focusVisible: {
        zIndex: 1,
        borderColor: getColor(theme, fc),
        boxShadow: `0 0 0 1px ${getColor(theme, fc)}`,
      },
      _disabled: {
        bg: 'interaction.support.disabled',
        borderColor: 'base.divider.strong',
        color: 'interaction.support.disabled-content',
        cursor: 'not-allowed',
        opacity: 1,
        _hover: {
          bg: 'interaction.support.disabled',
        },
        _active: {
          bg: 'interaction.support.disabled',
        },
      },
    },
    success: {
      pointerEvents: 'none',
      color: 'interaction.success.default',
    },
  }
})

const coreSizes = {
  xs: defineStyle(({ theme }) => {
    const themeTextStyles = get(theme, 'textStyles')

    return {
      textStyle: 'body-2',
      fontSize: themeTextStyles['body-2'].fontSize,
      px: '0.75rem',
      h: '2.25rem',
      // Override both as Chakra base theme now uses `height`.
      height: '2.25rem',
    }
  }),
  sm: defineStyle(({ theme }) => {
    const themeTextStyles = get(theme, 'textStyles')
    return {
      textStyle: 'body-2',
      fontSize: themeTextStyles['body-2'].fontSize,
      px: '0.75rem',
      h: '2.5rem',
      height: '2.5rem',
    }
  }),
  md: defineStyle(({ theme }) => {
    const themeTextStyles = get(theme, 'textStyles')
    return {
      px: '1rem',
      h: '2.75rem',
      height: '2.75rem',
      textStyle: 'body-1',
      fontSize: themeTextStyles['body-1'].fontSize,
    }
  }),
}

const sizes = {
  xs: definePartsStyle((props) => {
    const xsCoreSizes = coreSizes.xs(props)
    return {
      field: xsCoreSizes,
      addon: xsCoreSizes,
      element: xsCoreSizes,
      success: {
        ...xsCoreSizes,
        fontSize: '1rem',
      },
    }
  }),
  sm: definePartsStyle((props) => {
    const smCoreSizes = coreSizes.sm(props)
    return {
      field: smCoreSizes,
      addon: smCoreSizes,
      element: smCoreSizes,
      success: {
        ...smCoreSizes,
        fontSize: '1rem',
      },
    }
  }),
  md: definePartsStyle((props) => {
    const mdCoreSizes = coreSizes.md(props)
    return {
      field: mdCoreSizes,
      addon: mdCoreSizes,
      element: mdCoreSizes,
      success: {
        ...mdCoreSizes,
        fontSize: '1.25rem',
      },
    }
  }),
}

export const Input = defineMultiStyleConfig({
  variants: {
    outline: outlineVariant,
  },
  sizes,
  defaultProps: {
    variant: 'outline',
    size: 'md',
    // @ts-expect-error Invalid exported type.
    focusBorderColor: 'utility.focus-default',
    errorBorderColor: 'interaction.critical.default',
  },
})
