import { useMemo } from 'react'
import { Icon, type IconProps, useMediaQuery } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

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

export const SpinnerIcon = ({ speed = '2.5s', ...props }: SpinnerIconProps) => {
  const [prefersReducedMotion] = useMediaQuery([
    '(prefers-reduced-motion: reduce)',
  ])

  const animation = useMemo(
    () =>
      prefersReducedMotion ? undefined : `${spin} ${speed} linear infinite`,
    [prefersReducedMotion, speed],
  )

  return <Icon animation={animation} as={BxLoader} {...props} />
}
