import { Separator, Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  type BreadcrumbProps,
} from './'

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
} as Meta<BreadcrumbProps>

const BreadcrumbTemplate: StoryFn<BreadcrumbProps> = (args) => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Breadcrumb.CurrentLink>{`Breadcrumb ${
        args.size ?? ''
      }`}</Breadcrumb.CurrentLink>
    </Breadcrumb.Item>
  </Breadcrumb>
)

export const Default = BreadcrumbTemplate.bind({})

export const HoverFocusStates: StoryFn<BreadcrumbProps> = () => (
  <Breadcrumb>
    <Breadcrumb.Item>
      <Breadcrumb.Link data-hover href="#">
        Home
      </Breadcrumb.Link>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Breadcrumb.Link data-focus-visible href="#">
        Docs
      </Breadcrumb.Link>
    </Breadcrumb.Item>

    <Breadcrumb.Item>
      <Breadcrumb.CurrentLink>Breadcrumb</Breadcrumb.CurrentLink>
    </Breadcrumb.Item>
  </Breadcrumb>
)

export const SlashSeparator = BreadcrumbTemplate.bind({})
SlashSeparator.args = { separator: '/' }

export const NoSeparator = BreadcrumbTemplate.bind({})
NoSeparator.args = { separator: null }

// Covers the deprecated v1 alias re-exports (BreadcrumbItem / BreadcrumbLink).
export const WithDeprecatedAliases: StoryFn<BreadcrumbProps> = (args) => (
  <Breadcrumb {...args}>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <Breadcrumb.CurrentLink>Settings</Breadcrumb.CurrentLink>
    </BreadcrumbItem>
  </Breadcrumb>
)

export const Sizes: StoryFn<BreadcrumbProps> = () => (
  <Stack>
    <BreadcrumbTemplate size="xs" />
    <BreadcrumbTemplate size="sm" />
    <BreadcrumbTemplate size="md" />
    <Separator />
    <BreadcrumbTemplate separator="/" size="xs" />
    <BreadcrumbTemplate separator="/" size="sm" />
    <BreadcrumbTemplate separator="/" size="md" />
  </Stack>
)
