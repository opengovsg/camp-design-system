import { ButtonGroup, SimpleGrid, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxGitMerge } from '~/icons'

import { IconButton, IconButtonProps } from './IconButton'

export default {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'light' } },
} as Meta

const ButtonTemplate: StoryFn<IconButtonProps> = (args) => (
  <IconButton {...args}>
    <BxGitMerge />
  </IconButton>
)

const ButtonGroupTemplate: StoryFn<IconButtonProps> = (args) => {
  return (
    <SimpleGrid
      columns={2}
      gap={8}
      templateColumns="min-content auto"
      alignItems="center"
    >
      <Text>Default</Text>
      <ButtonGroup alignItems="center">
        <IconButton {...args} size="lg">
          <BxGitMerge />
        </IconButton>
        <IconButton {...args} size="md">
          <BxGitMerge />
        </IconButton>
      </ButtonGroup>
      <Text>Hover</Text>
      <ButtonGroup alignItems="center">
        <IconButton data-hover {...args} size="lg">
          <BxGitMerge />
        </IconButton>
        <IconButton data-hover {...args} size="md">
          <BxGitMerge />
        </IconButton>
      </ButtonGroup>
      <Text>Active</Text>
      <ButtonGroup alignItems="center">
        <IconButton {...args} data-active size="lg">
          <BxGitMerge />
        </IconButton>
        <IconButton {...args} data-active size="md">
          <BxGitMerge />
        </IconButton>
      </ButtonGroup>
      <Text>Disabled</Text>
      <ButtonGroup alignItems="center">
        <IconButton {...args} disabled size="lg">
          <BxGitMerge />
        </IconButton>
        <IconButton {...args} disabled size="md">
          <BxGitMerge />
        </IconButton>
      </ButtonGroup>
      <Text>Loading</Text>
      <ButtonGroup alignItems="center">
        <IconButton {...args} loading size="lg">
          <BxGitMerge />
        </IconButton>
        <IconButton {...args} loading size="md">
          <BxGitMerge />
        </IconButton>
      </ButtonGroup>
    </SimpleGrid>
  )
}

export const Default = ButtonTemplate.bind({})
Default.args = {
  variant: 'solid',
  size: 'md',
  textStyle: 'subhead-1',
}

export const SolidDefault = ButtonGroupTemplate.bind({})

export const SolidCritical = ButtonGroupTemplate.bind({})
SolidCritical.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'solid',
  colorPalette: 'critical',
}

export const SolidSuccess = ButtonGroupTemplate.bind({})
SolidSuccess.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'solid',
  colorPalette: 'success',
}

export const OutlineDefault = ButtonGroupTemplate.bind({})
OutlineDefault.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'outline',
}

export const OutlineCritical = ButtonGroupTemplate.bind({})
OutlineCritical.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'outline',
  colorPalette: 'critical',
}

export const OutlineNeutral = ButtonGroupTemplate.bind({})
OutlineNeutral.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'outline',
  colorPalette: 'neutral',
}

export const OutlineInverse = ButtonGroupTemplate.bind({})
OutlineInverse.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'outline',
  colorPalette: 'inverse',
}
OutlineInverse.parameters = {
  backgrounds: { default: 'dark' },
}

export const ClearDefault = ButtonGroupTemplate.bind({})
ClearDefault.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'clear',
}

export const ClearNeutral = ButtonGroupTemplate.bind({})
ClearNeutral.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'clear',
  colorPalette: 'neutral',
}

export const ClearInverse = ButtonGroupTemplate.bind({})
ClearInverse.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'clear',
  colorPalette: 'inverse',
}
ClearInverse.parameters = {
  backgrounds: { default: 'dark' },
}

export const ReverseDefault = ButtonGroupTemplate.bind({})
ReverseDefault.args = {
  'aria-label': 'Test Storybook Icon Button',
  variant: 'reverse',
}
