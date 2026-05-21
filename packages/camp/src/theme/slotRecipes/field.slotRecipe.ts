import { defineSlotRecipe } from '@chakra-ui/react'

export const fieldSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'label',
    'helperText',
    'errorText',
    'requiredIndicator',
    'optionalIndicator',
    'icon',
  ],
  base: {
    label: {
      color: 'base.content.strong',
      marginBottom: '0.75rem',
    },
    optionalIndicator: {
      color: 'base.content.medium',
      ml: '0.5rem',
    },
    helperText: {
      color: 'base.content.default',
      textStyle: 'body-2',
      marginTop: '0.5rem',
    },
    errorText: {
      color: 'utility.feedback.critical',
      textStyle: 'body-2',
      marginTop: '0.5rem',
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: '0.25rem',
    },
    icon: {
      fontSize: '1rem',
      flexShrink: 0,
      mt: '2px',
    },
  },
  variants: {
    size: {
      sm: {
        label: { textStyle: 'subhead-2' },
        optionalIndicator: { textStyle: 'caption-2' },
      },
      md: {
        label: { textStyle: 'subhead-1' },
        optionalIndicator: { textStyle: 'body-2' },
      },
    },
    variant: {
      // Success variant on helperText shows a check icon and stays the
      // default body colour (matches v1's FormHelperText `variant="success"`).
      success: {
        helperText: {
          color: 'utility.feedback.success',
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '0.25rem',
        },
        icon: {
          color: 'utility.feedback.success',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
