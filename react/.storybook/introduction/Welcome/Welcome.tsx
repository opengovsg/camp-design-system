import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react'
import { linkTo } from '@storybook/addon-links'

import { BxBulb, BxChevronRight, BxWrench } from '~/icons'
import { Link } from '~/Link'

export const Welcome = (): JSX.Element => {
  return (
    <Flex bg="brand.secondary.700" w="100%" minH="100vh" flexDir="column">
      <Box
        px={{ base: '1.5rem', md: '5.5rem', lg: '7.5rem' }}
        py={{ base: '1.5rem', md: '5rem', lg: '6rem' }}
        flex="1 0 auto"
      >
        <Box mb="3rem" color="white">
          <Heading as="h1" size="4xl">
            Welcome to our
          </Heading>
          <Text
            textStyle={[
              'responsive-display.heavy',
              'responsive-display.heavy-480',
              'responsive-display.heavy-1280',
            ]}
          >
            Camp 🏕
          </Text>
        </Box>
        <Box maxW="43.75rem">
          <Text textStyle="body-1" color="white" mb="1rem">
            Camp is the design system for Open Government Products. It helps us
            create consistent, accessible, highly usable, and delightful
            experiences for our public users. It is a living library and guide,
            and will evolve according to our product and user needs. Browse the
            stories in the sidebar to play with different React components, and
            see usage examples for every component.
          </Text>
          <Flex align="center" color="white">
            <Icon as={BxBulb} aria-hidden mr="0.5rem" fontSize="1.5rem" />
            <Text textStyle="subhead-1">
              Protip: Press '/' and start typing to search for a component
            </Text>
          </Flex>
        </Box>
      </Box>
      <Flex as="footer" flexShrink={0} flexDir={{ base: 'column', md: 'row' }}>
        <Box
          color="white"
          flex={1}
          bg="brand.primary.500"
          px={{ base: '1.5rem', md: '5.5rem', lg: '7.5rem' }}
          py={{ base: '1rem', md: '3.5rem', lg: '5.5rem' }}
        >
          <Flex align="center" color="white">
            <Icon as={BxWrench} aria-hidden mr="0.5rem" fontSize="1.5rem" />
            <Text textStyle="subhead-1">
              Built and maintained by{' '}
              <Link href="https://open.gov.sg" isExternal colorScheme="white">
                Open Government Products
              </Link>
            </Text>
          </Flex>
        </Box>
        <Flex bg="brand.primary.600" align="center" justify="center" px="4rem">
          <Link
            as="button"
            onClick={linkTo('Introduction/Guiding principles')}
            aria-label="Next story"
            colorScheme="whiteAlpha"
            color="white"
          >
            <BxChevronRight fontSize="4rem" />
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}
