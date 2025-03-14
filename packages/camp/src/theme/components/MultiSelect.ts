import {
  createMultiStyleConfigHelpers,
  mergeThemeOverride,
} from '@chakra-ui/react'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

import { anatomy } from '~/utils/anatomy'

import { Input } from './Input'
import { comboboxParts, SingleSelect } from './SingleSelect'

export const parts = anatomy('multiselect').parts(
  ...comboboxParts.keys,
  'field',
  'tag',
  'tagIcon',
  'chevron',
  'fieldwrapper',
  'itemContainer',
  'checkContainer',
)

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle((props) => {
  const { isFocused, isEmpty } = props
  const comboboxBaseStyle = pick(
    SingleSelect.baseStyle?.(props),
    comboboxParts.keys,
  )

  return {
    ...comboboxBaseStyle,
    chevron: {
      display: 'flex',
    },
    itemContainer: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      flexGrow: 1,
      gap: '4px',
    },
    fieldwrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      cursor: 'pointer',
      _disabled: {
        cursor: 'not-allowed',
      },
      transitionProperty: 'common',
      transitionDuration: 'normal',
    },
    icon: {
      display: 'inline-flex',
      h: 'fit-content',
      height: 'fit-content',
    },
    checkContainer: {
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top',
      borderColor: 'base.content.strong',
      bg: 'utility.ui',
    },
    tagIcon: {
      display: 'inline-flex',
      h: 'fit-content',
      height: 'fit-content',
    },
    field: {
      flexGrow: 1,
      width: 0,
      bg: 'transparent',
      minW: '3.75rem',
      px: '0.25rem',
      _disabled: {
        cursor: 'not-allowed',
      },
      alignSelf: 'center',
      _focusVisible: {
        outline: 'none',
      },
      ...(!isFocused && !isEmpty
        ? {
            cursor: 'pointer',
            _disabled: { cursor: 'not-allowed' },
            m: 0,
            minW: 0,
            minH: 0,
            h: 0,
            height: 0,
            w: 0,
            opacity: 0,
          }
        : {}),
    },
  }
})

const variantOutline = definePartsStyle((props) => {
  const comboboxVariantOutline = pick(
    SingleSelect.variants?.outline(props),
    comboboxParts.keys,
  )
  const inputFieldVariantOutline = Input.variants?.outline(props).field

  const { isFocused } = props

  return {
    ...comboboxVariantOutline,
    fieldwrapper: {
      borderRadius: 'base',
      ...inputFieldVariantOutline,
      _focusWithin: inputFieldVariantOutline?._focusVisible,
      ...(isFocused ? inputFieldVariantOutline?._focusVisible : {}),
    },
  }
})

const variants = {
  outline: variantOutline,
}

const sizes = {
  xs: definePartsStyle((props) =>
    mergeThemeOverride(omit(SingleSelect.sizes?.xs(props), ['field', 'icon']), {
      itemContainer: {
        // Padding for dropdown toggle.
        maxW: 'calc(100% - 2.5rem)',
      },
      tagIcon: {
        fontSize: '0.875rem',
        mr: '0.25rem',
      },
      icon: {
        fontSize: '0.875rem',
      },
      chevron: {
        py: '0.125rem',
        fontSize: '1rem',
        px: '0.5rem',
      },
      fieldwrapper: {
        ...SingleSelect.sizes?.xs(props).field,
        p: '0.5rem',
        minH: SingleSelect.sizes?.xs(props).field?.h,
        h: 'auto',
        height: 'auto',
      },
    }),
  ),
  sm: definePartsStyle((props) =>
    mergeThemeOverride(omit(SingleSelect.sizes?.sm(props), ['field', 'icon']), {
      itemContainer: {
        // Padding for dropdown toggle.
        maxW: 'calc(100% - 2.5rem)',
      },
      tagIcon: {
        fontSize: '1rem',
        mr: '0.25rem',
      },
      icon: {
        fontSize: '1rem',
      },
      chevron: {
        py: '0.25rem',
        fontSize: '1rem',
        px: '0.5rem',
      },
      fieldwrapper: {
        ...SingleSelect.sizes?.sm(props).field,
        p: '0.5rem',
        minH: SingleSelect.sizes?.sm(props).field?.h,
        h: 'auto',
        height: 'auto',
      },
    }),
  ),
  md: definePartsStyle((props) =>
    mergeThemeOverride(omit(SingleSelect.sizes?.md(props), ['field', 'icon']), {
      itemContainer: {
        // Padding for dropdown toggle.
        maxW: 'calc(100% - 2.75rem)',
      },
      icon: {
        fontSize: '1.25rem',
      },
      tagIcon: {
        fontSize: '1.25rem',
        mr: '0.25rem',
      },
      chevron: {
        py: '0.25rem',
        px: '0.5rem',
        fontSize: '1.25rem',
      },
      fieldwrapper: {
        ...SingleSelect.sizes?.md(props).field,
        p: '0.5rem',
        minH: SingleSelect.sizes?.md(props).field?.h,
        h: 'auto',
        height: 'auto',
      },
    }),
  ),
}

export const MultiSelect = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    ...SingleSelect.defaultProps,
    size: 'md',
  },
})
