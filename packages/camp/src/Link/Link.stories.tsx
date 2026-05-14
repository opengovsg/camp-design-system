import { Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxRightArrowAlt } from '~/icons'

import { Link, LinkProps } from './Link'

export default {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  decorators: [],
  args: {
    href: '#',
  },
} as Meta<LinkProps>

const Template: StoryFn<LinkProps> = (args) => <Link {...args} />
export const Default = Template.bind({})
Default.args = {
  children: 'Link',
  href: '',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  children: 'Disabled link',
  href: '',
}

export const WithExternalIcon = Template.bind({})
WithExternalIcon.args = {
  children: "This goes to Form's homepage",
  href: 'https://form.gov.sg',
  external: true,
}

export const VariantInline = Template.bind({})
VariantInline.args = {
  variant: 'inline',
  children: 'Inline variant link',
  external: false,
  href: '',
}

export const VariantInlineFocused = Template.bind({})
VariantInlineFocused.args = {
  ...VariantInline.args,
  // @ts-expect-error triggering focus-visible state
  'data-focus-visible': true,
}

export const VariantStandalone = Template.bind({})
VariantStandalone.args = {
  variant: 'standalone',
  children: (
    <>
      Standalone variant link
      <Icon as={BxRightArrowAlt} fontSize="1.5rem" ml="0.5rem" />
    </>
  ),
  external: false,
  href: '',
}

export const VariantStandaloneSizes = () => {
  return (
    <Stack>
      <Link href="" size="xs" variant="standalone">
        Standalone variant xs
      </Link>
      <Link href="" size="sm" variant="standalone">
        Standalone variant sm
      </Link>
      <Link href="" size="md" variant="standalone">
        Standalone variant md
      </Link>
    </Stack>
  )
}

export const VariantStandaloneFocused = Template.bind({})
VariantStandaloneFocused.args = {
  ...VariantStandalone.args,
  // @ts-expect-error triggering focus-visible state
  'data-focus-visible': true,
}

const TemplateGroup: StoryFn<LinkProps> = (args) => (
  <SimpleGrid
    columns={2}
    gap={8}
    templateColumns="max-content max-content"
    alignItems="center"
  >
    <Text>main</Text>
    <Link {...args} />
    <Text>sub</Text>
    <Link {...args} colorPalette="sub" />
    <Text>critical</Text>
    <Link {...args} colorPalette="critical" />
    <Text>warning</Text>
    <Link {...args} colorPalette="warning" />
    <Text>success</Text>
    <Link {...args} colorPalette="success" />
    <Text>neutral</Text>
    <Link {...args} colorPalette="neutral" />
  </SimpleGrid>
)

export const VariantInlineColorPalettes = TemplateGroup.bind({})
VariantInlineColorPalettes.args = {
  children: 'Link with colours',
  variant: 'inline',
  href: '',
}

export const VariantStandaloneColorPalettes = TemplateGroup.bind({})
VariantStandaloneColorPalettes.args = {
  children: 'Link with colours',
  variant: 'standalone',
  href: '',
}
