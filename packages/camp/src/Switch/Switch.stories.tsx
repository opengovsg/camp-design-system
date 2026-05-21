import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Switch, type SwitchProps } from './'

export default {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
} as Meta<SwitchProps>

const Template: StoryFn<SwitchProps> = (args) => <Switch {...args} />

export const Default = Template.bind({})

export const Checked = Template.bind({})
Checked.args = { defaultChecked: true }

export const Disabled = Template.bind({})
Disabled.args = { disabled: true }

export const DisabledChecked = Template.bind({})
DisabledChecked.args = { disabled: true, defaultChecked: true }

export const Loading = Template.bind({})
Loading.args = { isLoading: true }

export const LoadingChecked = Template.bind({})
LoadingChecked.args = { isLoading: true, defaultChecked: true }

export const Sizes: StoryFn = () => (
  <Stack>
    <Switch size="sm">Small</Switch>
    <Switch size="md" defaultChecked>
      Medium
    </Switch>
    <Switch size="lg">Large</Switch>
  </Stack>
)

const PALETTES = [
  'main',
  'sub',
  'info',
  'neutral',
  'success',
  'warning',
  'critical',
] as const

export const Colors: StoryFn = () => (
  <SimpleGrid
    columns={2}
    templateColumns="min-content auto"
    gap="1rem"
    alignItems="center"
  >
    {PALETTES.flatMap((palette) => [
      <Text key={`${palette}-label`}>{palette}</Text>,
      <Switch key={palette} defaultChecked colorPalette={palette} />,
    ])}
  </SimpleGrid>
)
