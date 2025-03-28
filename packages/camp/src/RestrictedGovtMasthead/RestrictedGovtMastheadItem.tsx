import { ElementType } from 'react'
import { Flex, Icon, Text } from '@chakra-ui/react'

export interface RestrictedGovtMastheadItemProps {
  icon: ElementType
  header: string
  children: React.ReactNode
}

export const RestrictedGovtMastheadItem = ({
  icon,
  header,
  children,
}: RestrictedGovtMastheadItemProps): JSX.Element => {
  return (
    <Flex flex={1} maxW="32rem">
      <Icon
        aria-hidden
        as={icon}
        fontSize={{ base: '1rem', lg: '1.5rem' }}
        mr={{ base: '0.5rem', lg: '0.75rem' }}
      />
      <Flex flexDir="column">
        <Text textStyle={{ base: 'caption-1', lg: 'subhead-1' }} mb="0.75rem">
          {header}
        </Text>
        {children}
      </Flex>
    </Flex>
  )
}
