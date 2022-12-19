import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  opacity: 1,
  borderStyle: 'solid',
  _dark: {
    borderColor: 'base.divider.inverse',
  },
})

const variantLight = defineStyle({
  borderColor: 'base.divider.light',
  _dark: {
    borderColor: 'base.divider.inverse',
  },
  borderWidth: '1px',
})

const variantMedium = defineStyle({
  borderColor: 'base.divider.medium',
  _dark: {
    borderColor: 'base.divider.inverse',
  },
  borderWidth: '1px',
})

const variantThick = defineStyle({
  borderColor: 'base.divider.dark',
  _dark: {
    borderColor: 'base.divider.inverse',
  },
  borderWidth: '2px',
})

const variantBrand = defineStyle({
  borderColor: 'base.divider.brand',
  _dark: {
    borderColor: 'base.divider.inverse',
  },
  borderWidth: '2px',
})

const variantInverse = defineStyle({
  borderColor: 'base.divider.inverse',
  borderWidth: '2px',
})

const variants = {
  light: variantLight,
  medium: variantMedium,
  thick: variantThick,
  brand: variantBrand,
  inverse: variantInverse,
}

export const Divider = defineStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'medium',
  },
})
