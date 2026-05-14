import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxBulb, BxsBank, BxsHeart } from '~/icons'

import { Badge, BadgeProps } from './Badge'

export default {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  decorators: [],
} as Meta

const Template: StoryFn<BadgeProps> = (args) => <Badge {...args} />

export const Solid = Template.bind({})
Solid.args = {
  colorPalette: 'success',
  children: 'Badge name',
  variant: 'solid',
}

export const SolidWithIcon = Template.bind({})
SolidWithIcon.args = {
  children: (
    <>
      <BxsBank />
      Badge name
      <BxsHeart />
    </>
  ),
  variant: 'solid',
}

export const Subtle = Template.bind({})
Subtle.args = {
  children: 'Badge name',
  variant: 'subtle',
}

export const SubtleWithIcon = Template.bind({})
SubtleWithIcon.args = {
  children: (
    <>
      <BxsBank />
      Badge name
      <BxsHeart />
    </>
  ),
  variant: 'subtle',
  colorPalette: 'warning',
}

export const Sizes: StoryFn<BadgeProps> = () => (
  <Stack gap={8}>
    <Badge>
      <BxBulb />
      Small
    </Badge>
    <Badge size="xs">
      <BxBulb />
      Extra Small
    </Badge>
  </Stack>
)

const TemplateGroup: StoryFn<BadgeProps> = (args) => (
  <SimpleGrid
    columns={2}
    gap={8}
    templateColumns="max-content max-content"
    alignItems="center"
  >
    <Text>main</Text>
    <Badge {...args} colorPalette="main" />
    <Text>sub</Text>
    <Badge {...args} colorPalette="sub" />
    <Text>warning</Text>
    <Badge {...args} colorPalette="warning" />
    <Text>success</Text>
    <Badge {...args} colorPalette="success" />
    <Text>critical</Text>
    <Badge {...args} colorPalette="critical" />
    <Text>neutral</Text>
    <Badge {...args} colorPalette="neutral" />
  </SimpleGrid>
)

export const SubtleColours = TemplateGroup.bind({})
SubtleColours.args = {
  children: 'Subtle',
  variant: 'subtle',
}

export const SolidColours = TemplateGroup.bind({})
SolidColours.args = {
  children: 'Solid',
  variant: 'solid',
}
