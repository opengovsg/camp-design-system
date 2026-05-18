import { SimpleGrid } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Textarea, type TextareaProps } from './'

export default {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} as Meta<TextareaProps>

const Template: StoryFn<TextareaProps> = (args) => <Textarea {...args} />

export const Default = Template.bind({})
Default.args = { placeholder: 'Test placeholder' }

export const Prefilled = Template.bind({})
Prefilled.args = {
  placeholder: 'Test placeholder',
  defaultValue: 'Prefilled field',
  isPrefilled: true,
}

export const Error = Template.bind({})
Error.args = {
  'aria-invalid': true,
  placeholder: 'Test placeholder',
  defaultValue: 'Field error',
}

export const Success = Template.bind({})
Success.args = {
  isSuccess: true,
  placeholder: 'Test placeholder',
  defaultValue: 'Field success',
}

export const Disabled = Template.bind({})
Disabled.args = {
  defaultValue: 'Some text',
  placeholder: 'Test placeholder',
  disabled: true,
}

export const Sizes: StoryFn = () => (
  <SimpleGrid columns={3} gap="0.5rem">
    <Textarea placeholder="Extra Small placeholder" size="xs" />
    <Textarea placeholder="Small placeholder" size="sm" />
    <Textarea placeholder="Medium placeholder" size="md" />

    <Textarea placeholder="Extra Small" size="xs" defaultValue="xs filled" />
    <Textarea placeholder="Small" size="sm" defaultValue="sm filled" />
    <Textarea placeholder="Medium" size="md" defaultValue="md filled" />
  </SimpleGrid>
)
