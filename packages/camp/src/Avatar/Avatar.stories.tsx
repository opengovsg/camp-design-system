import { Fragment } from 'react'
import { SimpleGrid, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxsUser } from '~/icons/BxsUser'

import { Avatar, AvatarRootProps } from './'

export default {
  title: 'Components/Avatar',
  component: Avatar.Root,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'solid',
    colorPalette: 'main',
  },
} as Meta<AvatarRootProps>

const Template: StoryFn<AvatarRootProps> = (args) => {
  return (
    <Avatar.Root {...args}>
      <Avatar.Fallback name="ABC" />
    </Avatar.Root>
  )
}

const SizesTemplate: StoryFn<AvatarRootProps> = (args) => {
  return (
    <SimpleGrid
      columns={4}
      gap={8}
      templateColumns="min-content min-content min-content auto"
      alignItems="center"
    >
      {(['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Fragment key={size}>
          <Text>{size}</Text>
          <Avatar.Root {...args} size={size}>
            <Avatar.Fallback name="ABC" />
          </Avatar.Root>
          <Avatar.Root {...args} size={size} variant="subtle">
            <Avatar.Fallback name="ABC" />
          </Avatar.Root>
          <Avatar.Root {...args} size={size}>
            <Avatar.Icon>
              <BxsUser />
            </Avatar.Icon>
          </Avatar.Root>
        </Fragment>
      ))}
    </SimpleGrid>
  )
}

const ColoursTemplate: StoryFn<AvatarRootProps> = ({ variant, ...args }) => {
  return (
    <SimpleGrid
      columns={4}
      gap={8}
      templateColumns="min-content min-content min-content auto"
      alignItems="center"
    >
      {(['main', 'sub', 'success', 'critical', 'warning'] as const).map(
        (colorPalette) => (
          <Fragment key={colorPalette}>
            <Text>{colorPalette}</Text>
            <Avatar.Root
              {...args}
              colorPalette={colorPalette}
              variant={variant}
            >
              <Avatar.Fallback name="ABC" />
            </Avatar.Root>
            <Avatar.Root
              {...args}
              colorPalette={colorPalette}
              variant={variant ?? 'subtle'}
            >
              <Avatar.Fallback name="ABC" />
            </Avatar.Root>
            <Avatar.Root
              {...args}
              colorPalette={colorPalette}
              variant={variant}
            >
              <Avatar.Icon>
                <BxsUser />
              </Avatar.Icon>
            </Avatar.Root>
          </Fragment>
        ),
      )}
    </SimpleGrid>
  )
}

export const DefaultVariantSolid = Template.bind({})

export const VariantSolidColours = ColoursTemplate.bind({})
VariantSolidColours.args = {
  variant: 'solid',
}

export const VariantSubtleColours = ColoursTemplate.bind({})
VariantSubtleColours.args = {
  variant: 'subtle',
}

export const VariantSubtle = Template.bind({})
VariantSubtle.args = {
  variant: 'subtle',
}

// Chakra v3 has a known typing issue: `Avatar.Image` does not surface `src` on
// its props type even though it is forwarded at runtime. Cast through the
// underlying HTML attributes to satisfy the type-checker. See
// https://github.com/chakra-ui/chakra-ui/issues for the upstream tracker once
// filed.
export const WithImage: StoryFn<AvatarRootProps> = (args) => {
  return (
    <Avatar.Root {...args}>
      <Avatar.Fallback name="KR" />
      <Avatar.Image
        {...({
          src: 'https://avatars.githubusercontent.com/u/1?v=4',
        } as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    </Avatar.Root>
  )
}

export const WithBorder = Template.bind({})
WithBorder.args = {
  boxShadow: `0 0 0 4px var(--chakra-colors-blue-300)`,
}

export const Sizes = SizesTemplate.bind({})
