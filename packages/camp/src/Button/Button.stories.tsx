import { ButtonGroup, SimpleGrid, Text } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxRightArrowAlt, BxUpload } from '~/icons'

import { Button, ButtonProps } from './Button'

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
} as Meta

const ButtonTemplate: StoryFn<ButtonProps> = (args) => <Button {...args} />

const ButtonGroupTemplate: StoryFn<ButtonProps> = (args) => {
  return (
    <SimpleGrid
      columns={2}
      gap={8}
      templateColumns="min-content auto"
      alignItems="center"
    >
      <Text>Default</Text>
      <ButtonGroup>
        <Button {...args}>Button</Button>
        <Button {...args}>
          <BxUpload fontSize="1.5rem" />
          Leading
        </Button>
        <Button {...args}>
          Trailing
          <BxRightArrowAlt fontSize="1.5rem" />
        </Button>
      </ButtonGroup>
      <Text>Hover</Text>
      <ButtonGroup>
        <Button data-hover {...args}>
          Button
        </Button>
        <Button data-hover {...args}>
          <BxUpload fontSize="1.5rem" />
          Leading
        </Button>
        <Button data-hover {...args}>
          Trailing
          <BxRightArrowAlt fontSize="1.5rem" />
        </Button>
      </ButtonGroup>
      <Text>Active</Text>
      <ButtonGroup>
        <Button data-active {...args}>
          Button
        </Button>
        <Button data-active {...args}>
          <BxUpload fontSize="1.5rem" />
          Leading
        </Button>
        <Button data-active {...args}>
          Trailing
          <BxRightArrowAlt fontSize="1.5rem" />
        </Button>
      </ButtonGroup>
      <Text>Disabled</Text>
      <ButtonGroup>
        <Button disabled {...args}>
          Button
        </Button>
        <Button disabled {...args}>
          <BxUpload fontSize="1.5rem" />
          Leading
        </Button>
        <Button disabled {...args}>
          Trailing
          <BxRightArrowAlt fontSize="1.5rem" />
        </Button>
      </ButtonGroup>
      <Text>Loading</Text>
      <ButtonGroup>
        <Button loading {...args}>
          Button
        </Button>
        <Button loading loadingText="Leading" {...args}></Button>
        <Button
          loading
          loadingText="Trailing"
          spinnerPlacement="end"
          {...args}
        ></Button>
      </ButtonGroup>
    </SimpleGrid>
  )
}

export const Default = ButtonTemplate.bind({})
Default.args = {
  variant: 'solid',
  children: 'Button',
  size: 'md',
  textStyle: 'subhead-1',
}

export const FullWidth = ButtonTemplate.bind({})
FullWidth.args = {
  variant: 'solid',
  children: 'Button',
  isFullWidth: true,
  textStyle: 'subhead-1',
}

export const SolidDefault = ButtonGroupTemplate.bind({})

export const SolidCritical = ButtonGroupTemplate.bind({})
SolidCritical.args = {
  variant: 'solid',
  colorPalette: 'critical',
}

export const SolidSuccess = ButtonGroupTemplate.bind({})
SolidSuccess.args = {
  variant: 'solid',
  colorPalette: 'success',
}

export const OutlineDefault = ButtonGroupTemplate.bind({})
OutlineDefault.args = {
  variant: 'outline',
}

export const OutlineCritical = ButtonGroupTemplate.bind({})
OutlineCritical.args = {
  variant: 'outline',
  colorPalette: 'critical',
}

export const OutlineNeutral = ButtonGroupTemplate.bind({})
OutlineNeutral.args = {
  variant: 'outline',
  colorPalette: 'neutral',
}

export const OutlineInverse = ButtonGroupTemplate.bind({})
OutlineInverse.args = {
  variant: 'outline',
  colorPalette: 'inverse',
}
OutlineInverse.parameters = {
  backgrounds: { default: 'dark' },
}

export const ClearDefault = ButtonGroupTemplate.bind({})
ClearDefault.args = {
  variant: 'clear',
}

export const ClearNeutral = ButtonGroupTemplate.bind({})
ClearNeutral.args = {
  variant: 'clear',
  colorPalette: 'neutral',
}

export const ClearInverse = ButtonGroupTemplate.bind({})
ClearInverse.args = {
  variant: 'clear',
  colorPalette: 'inverse',
}
ClearInverse.parameters = {
  backgrounds: { default: 'dark' },
}

export const ReverseDefault = ButtonGroupTemplate.bind({})
ReverseDefault.args = {
  variant: 'reverse',
}

export const LinkPrimary = ButtonGroupTemplate.bind({})
LinkPrimary.args = {
  variant: 'link',
  colorPalette: 'main',
}

export const Sizes = () => (
  <SimpleGrid columns={4} gap="1rem" textAlign="center">
    <Text>Solid</Text>
    <Text>Outline</Text>
    <Text>Clear</Text>
    <Text>Reverse</Text>
    <Button size="xs" variant="solid">
      extra small
    </Button>
    <Button size="xs" variant="outline">
      extra small
    </Button>
    <Button size="xs" variant="clear" colorPalette="neutral">
      extra small
    </Button>
    <Button size="xs" variant="reverse">
      extra small
    </Button>
    <Button size="sm" variant="solid">
      small
    </Button>
    <Button size="sm" variant="outline">
      small
    </Button>
    <Button size="sm" variant="clear" colorPalette="neutral">
      small
    </Button>
    <Button size="sm" variant="reverse">
      small
    </Button>
    <Button size="md" variant="solid">
      medium
    </Button>
    <Button size="md" variant="outline">
      medium
    </Button>
    <Button size="md" variant="clear" colorPalette="neutral">
      medium
    </Button>
    <Button size="md" variant="reverse">
      medium
    </Button>
    <Button size="lg" variant="solid">
      large
    </Button>
    <Button size="lg" variant="outline">
      large
    </Button>
    <Button size="lg" variant="clear" colorPalette="neutral">
      large
    </Button>
    <Button size="lg" variant="reverse">
      large
    </Button>
  </SimpleGrid>
)
