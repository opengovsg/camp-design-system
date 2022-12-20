import { useMemo } from 'react'
import {
  Icon,
  IconProps,
  keyframes,
  usePrefersReducedMotion,
} from '@chakra-ui/react'

import { BxLoader } from '~/icons'

export type SpinnerIconProps = IconProps

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

export const SpinnerIcon = ({
  speed = '2.5s',
  ...props
}: SpinnerIconProps): JSX.Element => {
  const prefersReducedMotion = usePrefersReducedMotion()

  const animation = useMemo(
    () =>
      prefersReducedMotion ? undefined : `${spin} ${speed} linear infinite`,
    [prefersReducedMotion, speed],
  )
  return <Icon animation={animation} as={BxLoader} {...props} />
}
