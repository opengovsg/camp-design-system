import { Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Banner, type BannerProps } from './'

export default {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
} as Meta<BannerProps>

const Template: StoryFn<BannerProps> = (args) => <Banner {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'You can insert a normal string here.',
}

export const Info = Template.bind({})
Info.args = {
  variant: 'info',
  children: 'This is a dismissable info banner',
  isDismissable: true,
}

export const Warn = Template.bind({})
Warn.args = {
  variant: 'warn',
  children: 'This is a warning banner',
}

export const Error = Template.bind({})
Error.args = {
  variant: 'error',
  children: 'This is an error banner',
}

export const Sizes: StoryFn<BannerProps> = (args) => (
  <Stack>
    <Banner {...args} variant="info">
      This is a {args.size} dismissable info banner
    </Banner>
    <Banner {...args} variant="warn">
      This is a {args.size} warning banner
    </Banner>
    <Banner {...args} variant="error">
      This is a {args.size} error banner
    </Banner>
  </Stack>
)
Sizes.args = { size: 'md' }

export const SmallSize = Sizes.bind({})
SmallSize.args = { size: 'sm' }
