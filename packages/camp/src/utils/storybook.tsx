import { Box, BoxProps } from '@chakra-ui/react'
import { Args, Decorator } from '@storybook/react'
import { format } from 'date-fns'
import mockdate from 'mockdate'

import { breakpoints } from '~/theme/foundations/breakpoints'

/**
 * Helper function to convert theme breakpoint into viewport width in px for
 * Chromatic viewpoint snapshots.
 * @param breakpoint the theme breakpoint to convert
 * @returns the number pixel width of the given breakpoint.
 */
const breakpointToViewportWidth = (breakpoint: keyof typeof breakpoints) => {
  const rem = 16
  return parseInt(breakpoints[breakpoint].replace('em', '')) * rem
}

export const fixedHeightDecorator =
  (height: BoxProps['h']): Decorator =>
  (storyFn) => <Box h={height}>{storyFn()}</Box>

/**
 * Viewports mapping viewport key to their width in (pixel) number.
 * Used for Chromatic viewpoint snapshots which requires the numbers in pixels.
 */
export const viewports = {
  sm: breakpointToViewportWidth('sm'),
  md: breakpointToViewportWidth('md'),
  lg: breakpointToViewportWidth('lg'),
  xl: breakpointToViewportWidth('xl'),
}

export const getMobileViewParameters = () => {
  return {
    viewport: {
      defaultViewport: 'mobile1',
    },
    chromatic: { viewports: [viewports.sm] },
  }
}

export const getTabletViewParameters = () => {
  return {
    viewport: {
      defaultViewport: 'tablet',
    },
    chromatic: { viewports: [viewports.md] },
  }
}

export const mockDateDecorator: Decorator<Args> = (storyFn, { parameters }) => {
  mockdate.reset()

  if (!parameters.mockdate) {
    return storyFn()
  }

  mockdate.set(parameters.mockdate)

  const mockedDate = format(parameters.mockdate, 'dd-mm-yyyy HH:mma')

  return (
    <Box>
      <Box
        pos="fixed"
        top={0}
        right={0}
        bg="white"
        p="0.25rem"
        fontSize="0.75rem"
        lineHeight={1}
        zIndex="docked"
      >
        Mocking date: {mockedDate}
      </Box>
      {storyFn()}
    </Box>
  )
}
