import { createElement } from 'react'
import {
  CreateToastFnReturn,
  useToast as useChakraToast,
  UseToastOptions as ChakraUseToastOptions,
} from '@chakra-ui/react'
import omit from 'lodash/omit'

import { Toast } from './Toast'

type UseToastOptions = ChakraUseToastOptions

export const useToast = ({
  status = 'success',
  duration = 6000,
  position = 'top',
  containerStyle: containerStyleProps,
  ...initialProps
}: UseToastOptions = {}): CreateToastFnReturn => {
  const initialToastProps = omit(initialProps, ['onClose', 'status'])

  return useChakraToast({
    ...initialToastProps,
    containerStyle: {
      maxWidth: 'initial',
      ...containerStyleProps,
    },
    status,
    duration,
    position,
    render: (props) => {
      return createElement(Toast, props)
    },
  })
}
