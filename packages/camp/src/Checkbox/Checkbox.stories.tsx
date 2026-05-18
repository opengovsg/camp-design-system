import { useState } from 'react'
import { Stack, VStack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Checkbox, type CheckboxProps } from './'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} as Meta<CheckboxProps>

const Template: StoryFn<CheckboxProps> = (args) => (
  <Checkbox {...args}>{args.name ?? 'Checkbox label'}</Checkbox>
)

export const Default = Template.bind({})
Default.args = { name: 'Default' }

export const Checked = Template.bind({})
Checked.args = { defaultChecked: true, name: 'Checked' }

export const Indeterminate: StoryFn = () => {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(
    'indeterminate',
  )
  return (
    <Checkbox checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>
      Indeterminate
    </Checkbox>
  )
}

export const Disabled = Template.bind({})
Disabled.args = { disabled: true, name: 'Disabled' }

export const DisabledChecked = Template.bind({})
DisabledChecked.args = {
  disabled: true,
  defaultChecked: true,
  name: 'Disabled checked',
}

export const Sizes: StoryFn = () => (
  <Stack>
    <Checkbox size="xs">Extra small</Checkbox>
    <Checkbox size="sm">Small</Checkbox>
    <Checkbox size="md">Medium</Checkbox>
  </Stack>
)

export const WithOthers: StoryFn = () => (
  <VStack align="start">
    <Checkbox>Option A</Checkbox>
    <Checkbox>Option B</Checkbox>
    <Checkbox.OthersWrapper>
      <Checkbox.OthersCheckbox />
      <Checkbox.OthersInput placeholder="Please specify" />
    </Checkbox.OthersWrapper>
  </VStack>
)
