import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

import { anatomy } from '~/utils/anatomy'

import { Input } from './Input'

export const parts = anatomy('taginput').parts('container', 'field', 'tag')

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'text',
    height: 'auto',
    maxW: '100%',
    w: '100%',
    _disabled: {
      cursor: 'not-allowed',
    },
    transitionProperty: 'common',
    transitionDuration: 'normal',
  },
  field: {
    _focusVisible: {
      outline: 'none',
    },
    flexGrow: 1,
    _disabled: {
      cursor: 'not-allowed',
    },
  },
})

const variantOutline = definePartsStyle((props) => {
  const inputFieldVariantOutline = Input.variants?.outline(props).field

  return {
    container: {
      ...inputFieldVariantOutline,
      _focusWithin: {
        ...inputFieldVariantOutline?._focusVisible,
      },
      h: 'auto',
    },
  }
})

const sizes = {
  sm: definePartsStyle((props) => {
    const smInputFieldProps = Input.sizes?.sm(props).field
    return {
      container: {
        ...smInputFieldProps,
        p: 'calc(0.5rem - 2px)',
        minH: smInputFieldProps?.h,
        gap: '0.25rem',
      },
      field: {
        h: '1.5rem',
        pl: '0.5rem',
      },
    }
  }),
  md: definePartsStyle((props) => {
    const mdInputFieldProps = Input.sizes?.md(props).field
    return {
      container: {
        ...mdInputFieldProps,
        p: 'calc(0.5rem - 2px)',
        minH: mdInputFieldProps?.h,
        gap: '0.25rem',
      },
      field: {
        h: '1.75rem',
        pl: '0.5rem',
      },
    }
  }),
}

export const TagInput = defineMultiStyleConfig({
  baseStyle,
  variants: {
    outline: variantOutline,
  },
  sizes,
  defaultProps: {
    size: 'md',
    variant: 'outline',
    // @ts-expect-error Invalid exported type.
    focusBorderColor: Input.defaultProps?.focusBorderColor,
    // @ts-expect-error Invalid exported type.
    errorBorderColor: Input.defaultProps?.errorBorderColor,
    colorScheme: 'primary',
  },
})
