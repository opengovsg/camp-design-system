import { Meta, StoryFn } from '@storybook/react'

import { Banner, BannerProps } from './Banner'

export default {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  decorators: [],
  parameters: {
    backgrounds: { default: 'light' },
  },
} as Meta<BannerProps>

const Template: StoryFn<BannerProps> = (args) => <Banner {...args} />
export const Default = Template.bind({})
Default.args = {
  children: 'You can insert a normal string here.',
  useMarkdown: false,
}

export const WithMarkdown = Template.bind({})
WithMarkdown.args = {
  children: `**Markdown** is also accepted.`,
  useMarkdown: true,
}

export const Info = Template.bind({})
Info.args = {
  variant: 'info',
  children: `Look at this [website](http://localhost:6006) or
  [Form](https://www.form.gov.sg).`,
  useMarkdown: true,
  isDismissable: true,
}

export const Warn = Template.bind({})
Warn.args = {
  variant: 'warn',
  children: `Look at this [website](http://localhost:6006) or
  [Form](https://www.form.gov.sg).`,
  useMarkdown: true,
}

export const Error = Template.bind({})
Error.args = {
  variant: 'error',
  children: `Look at this [website](http://localhost:6006) or
  [Form](https://www.form.gov.sg).`,
  useMarkdown: true,
}
