import { Button, Icon } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxsHelpCircle } from '~/icons'

import { Tooltip, type TooltipProps } from './'

export default {
  title: 'Components/TouchableTooltip',
  component: Tooltip,
  tags: ['autodocs'],
} as Meta<TooltipProps>

const Template: StoryFn<TooltipProps> = ({ children, ...args }) => (
  <Tooltip {...args}>{children}</Tooltip>
)

export const Default = Template.bind({})
Default.args = {
  label: 'Tooltip content goes here',
  children: <Icon as={BxsHelpCircle} aria-hidden ml="0.5rem" />,
}

export const NoArrow = Template.bind({})
NoArrow.args = {
  label: 'Tooltip content goes here',
  children: <Icon as={BxsHelpCircle} aria-hidden ml="0.5rem" />,
  hasArrow: false,
}

export const CustomChild = Template.bind({})
CustomChild.args = {
  label: 'Tooltip content goes here',
  children: <Button>Button</Button>,
  wrapperAs: 'div',
  wrapperStyles: { h: 'fit-content', w: 'fit-content' },
}

export const OpenByDefault = Template.bind({})
OpenByDefault.args = {
  label: 'Tooltip content goes here',
  children: <Icon as={BxsHelpCircle} aria-hidden ml="0.5rem" />,
  isOpen: true,
}
