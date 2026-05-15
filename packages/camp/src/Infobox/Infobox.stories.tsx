import { SimpleGrid } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Infobox, type InfoboxProps } from './'

export default {
  title: 'Components/Infobox',
  component: Infobox,
  tags: ['autodocs'],
} as Meta<InfoboxProps>

const InfoboxTemplate: StoryFn<InfoboxProps> = (args) => <Infobox {...args} />

export const Default = InfoboxTemplate.bind({})
Default.args = {
  children: 'You can insert a normal string here.',
}

export const Info = InfoboxTemplate.bind({})
Info.args = {
  variant: 'info',
  children: 'This is an info infobox.',
}

export const Warning = InfoboxTemplate.bind({})
Warning.args = {
  variant: 'warning',
  children:
    'The highlighted fields in this form have been pre-filled according to the link that you clicked. Please check that these values are what you intend to submit, and edit if necessary.',
}

export const Error = InfoboxTemplate.bind({})
Error.args = {
  variant: 'error',
  children: 'Only 30 MyInfo fields are allowed in Email mode (30/30).',
}

export const Success = InfoboxTemplate.bind({})
Success.args = {
  variant: 'success',
  children: "You are your mother's proudest moment.",
}

export const CustomIcon = InfoboxTemplate.bind({})
CustomIcon.args = {
  variant: 'info',
  children: 'You can also provide your own icon.',
  icon: '👋',
}

const VARIANTS = ['info', 'warning', 'error', 'success'] as const
const SIZES = ['sm', 'md'] as const

export const Sizes: StoryFn<InfoboxProps> = () => (
  <SimpleGrid columns={2} gap="1rem">
    {VARIANTS.flatMap((variant) =>
      SIZES.map((size) => (
        <Infobox
          key={`${variant}-${size}`}
          variant={variant}
          size={size}
          height="fit-content"
        >
          {`${size === 'sm' ? 'Small' : 'Medium'} ${variant}`}
        </Infobox>
      )),
    )}
  </SimpleGrid>
)
