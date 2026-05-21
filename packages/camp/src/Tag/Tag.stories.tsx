import { Fragment } from 'react'
import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxsInfoCircle } from '~/icons'

import {
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  type TagRootProps,
} from './'

export default {
  title: 'Components/Tag',
  component: Tag.Root,
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'subtle',
    colorPalette: 'main',
  },
} as Meta<TagRootProps>

const Template: StoryFn<TagRootProps & { label?: string }> = ({
  label = 'Tag',
  ...args
}) => (
  <Tag.Root {...args}>
    <Tag.Label>{label}</Tag.Label>
  </Tag.Root>
)

export const Subtle = Template.bind({})
Subtle.args = { variant: 'subtle', label: 'Subtle tag' }

export const Solid = Template.bind({})
Solid.args = { variant: 'solid', label: 'Solid tag' }

export const WithCloseButton: StoryFn<TagRootProps> = (args) => (
  <Tag.Root {...args}>
    <Tag.Label>Solid tag</Tag.Label>
    <Tag.EndElement>
      <Tag.CloseTrigger aria-label="Remove selected option" />
    </Tag.EndElement>
  </Tag.Root>
)
WithCloseButton.args = { variant: 'subtle', colorPalette: 'main' }

export const WithStartEndElement: StoryFn<TagRootProps> = (args) => (
  <Tag.Root {...args}>
    <Tag.StartElement>
      <BxsInfoCircle />
    </Tag.StartElement>
    <Tag.Label>Solid tag</Tag.Label>
    <Tag.EndElement>
      <BxsInfoCircle />
    </Tag.EndElement>
  </Tag.Root>
)
WithStartEndElement.args = { variant: 'solid', colorPalette: 'warning' }

export const WithDeprecatedAliases: StoryFn<TagRootProps> = (args) => (
  <Tag.Root {...args}>
    <TagLeftIcon>
      <BxsInfoCircle />
    </TagLeftIcon>
    <TagLabel>Solid tag</TagLabel>
    <TagRightIcon>
      <BxsInfoCircle />
    </TagRightIcon>
    <TagCloseButton aria-label="Remove selected option" />
  </Tag.Root>
)
WithDeprecatedAliases.args = { variant: 'subtle', colorPalette: 'main' }

export const Rounded: StoryFn<TagRootProps> = (args) => (
  <Tag.Root {...args}>
    <Tag.Label>borderRadius: full</Tag.Label>
    <Tag.EndElement>
      <Tag.CloseTrigger aria-label="Remove selected option" />
    </Tag.EndElement>
  </Tag.Root>
)
Rounded.args = { borderRadius: 'full' }

export const Stretched: StoryFn<TagRootProps> = (args) => (
  <Tag.Root {...args}>
    <Tag.Label>width: 100%</Tag.Label>
    <Tag.EndElement>
      <Tag.CloseTrigger aria-label="Remove selected option" />
    </Tag.EndElement>
  </Tag.Root>
)
Stretched.args = { w: '100%', variant: 'solid', colorPalette: 'success' }

const PALETTES = [
  'main',
  'sub',
  'info',
  'neutral',
  'success',
  'warning',
  'critical',
] as const
const SIZES = ['xs', 'sm', 'md'] as const

const TemplateGroup: StoryFn<TagRootProps> = ({ variant }) => (
  <SimpleGrid
    columns={1 + SIZES.length * 2}
    gap={8}
    templateColumns={`min-content repeat(${SIZES.length * 2}, max-content)`}
    alignItems="center"
  >
    <Box />
    {SIZES.flatMap((s) => [
      <Text key={`${s}`}>{s}</Text>,
      <Text key={`${s}-disabled`}>{s}-disabled</Text>,
    ])}
    {PALETTES.map((palette) => (
      <Fragment key={palette}>
        <Text>{palette}</Text>
        {SIZES.flatMap((size) => [
          <Tag.Root
            key={`${palette}-${size}`}
            size={size}
            colorPalette={palette}
            variant={variant}
          >
            <Tag.StartElement>
              <BxsInfoCircle />
            </Tag.StartElement>
            <Tag.Label>{variant} tag</Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger aria-label="Remove" />
            </Tag.EndElement>
          </Tag.Root>,
          <Tag.Root
            key={`${palette}-${size}-disabled`}
            size={size}
            colorPalette={palette}
            variant={variant}
            aria-disabled
          >
            <Tag.StartElement>
              <BxsInfoCircle />
            </Tag.StartElement>
            <Tag.Label>{variant} tag</Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger aria-label="Remove" />
            </Tag.EndElement>
          </Tag.Root>,
        ])}
      </Fragment>
    ))}
  </SimpleGrid>
)

export const SubtleColours = TemplateGroup.bind({})
SubtleColours.args = { variant: 'subtle' }

export const SolidColours = TemplateGroup.bind({})
SolidColours.args = { variant: 'solid' }
