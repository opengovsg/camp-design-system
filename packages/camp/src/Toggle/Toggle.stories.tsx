import { VStack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Toggle, type ToggleProps } from './'

export default {
  title: 'Templates/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} as Meta<ToggleProps>

const AllToggleStates: StoryFn<ToggleProps> = (args) => (
  <VStack align="start" w="50%">
    <Toggle
      {...args}
      label="Selected"
      description="Some description"
      containerStyles={{ w: '60%' }}
      defaultChecked
    />
    <Toggle
      {...args}
      label="A really long label to demonstrate the minimum left margin of the toggle"
      description="The description is also really long for the same reason"
      containerStyles={{ w: '60%' }}
      defaultChecked
    />
    <Toggle
      {...args}
      label="Selected loading"
      isLoading
      description="Some description"
      containerStyles={{ w: '60%' }}
      defaultChecked
    />
    <Toggle
      {...args}
      label="Unselected"
      description="Some description"
      containerStyles={{ w: '60%' }}
    />
    <Toggle
      {...args}
      label="Unselected loading"
      isLoading
      description="Some description"
      containerStyles={{ w: '60%' }}
    />
    <Toggle
      {...args}
      label="Selected and disabled"
      description="Some description"
      containerStyles={{ w: '60%' }}
      defaultChecked
      disabled
    />
    <Toggle
      {...args}
      label="Unselected and disabled"
      description="Some description"
      containerStyles={{ w: '60%' }}
      disabled
    />
    <Toggle
      {...args}
      label="Wider toggle"
      description="A toggle in a wider container to demonstrate that the width stretches to that of the container"
    />
  </VStack>
)

export const ToggleStates = AllToggleStates.bind({})
ToggleStates.storyName = 'All states'
