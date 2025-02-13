import { SimpleGrid } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Input, InputProps } from './Input'

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [],
  args: {
    placeholder: 'Test placeholder',
  },
} as Meta<InputProps>

const Template: StoryFn<InputProps> = (args) => <Input {...args} />
export const Default = Template.bind({})

export const Prefilled = Template.bind({})
Prefilled.args = {
  defaultValue: 'Prefilled field',
  isPrefilled: true,
}
export const Error = Template.bind({})
Error.args = {
  isInvalid: true,
  defaultValue: 'Field error',
}
export const Success = Template.bind({})
Success.args = {
  isSuccess: true,
  defaultValue: 'Field success',
}
export const Disabled = Template.bind({})
Disabled.args = {
  defaultValue: 'Some text',
  isDisabled: true,
}
export const Themeable = Template.bind({})
Themeable.args = {
  defaultValue: 'Some text',
  width: '300px',
}

export const Sizes = () => (
  <SimpleGrid columns={3} spacing="0.5rem">
    <Input placeholder="Extra Small placeholder" size="xs" />
    <Input placeholder="Small placeholder" size="sm" />
    <Input placeholder="Medium placeholder" size="md" />

    <Input placeholder="Extra Small" size="xs" defaultValue="xs filled" />
    <Input placeholder="Small" size="sm" defaultValue="sm filled" />
    <Input placeholder="Medium" size="md" defaultValue="md filled" />

    <Input
      placeholder="Extra Small"
      size="xs"
      isSuccess
      defaultValue="xs success"
    />
    <Input placeholder="Small" size="sm" isSuccess defaultValue="sm success" />
    <Input placeholder="Medium" size="md" isSuccess defaultValue="md success" />

    <Input
      placeholder="Extra Small"
      size="xs"
      isDisabled
      defaultValue="xs disabled"
    />
    <Input
      placeholder="Small"
      size="sm"
      isDisabled
      defaultValue="sm disabled"
    />
    <Input
      placeholder="Medium"
      size="md"
      isDisabled
      defaultValue="md disabled"
    />

    <Input
      placeholder="Extra Small"
      size="xs"
      defaultValue="xs prefilled"
      isPrefilled
    />
    <Input
      placeholder="Small"
      size="sm"
      defaultValue="sm prefilled"
      isPrefilled
    />
    <Input
      placeholder="Medium"
      size="md"
      defaultValue="md prefilled"
      isPrefilled
    />

    <Input
      placeholder="Extra Small"
      size="xs"
      defaultValue="xs error"
      isInvalid
    />
    <Input placeholder="Small" size="sm" defaultValue="sm error" isInvalid />
    <Input placeholder="Medium" size="md" defaultValue="md error" isInvalid />
  </SimpleGrid>
)
