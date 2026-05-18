import { Meta, StoryFn } from '@storybook/react'

import { Menu, type MenuProps } from './'

export default {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
} as Meta<MenuProps>

export const Default: StoryFn<MenuProps> = (args) => (
  <Menu {...args}>
    {({ isOpen }) => (
      <>
        <Menu.Button isOpen={isOpen}>Open menu</Menu.Button>
        <Menu.List>
          <Menu.Item value="option-a">Option A</Menu.Item>
          <Menu.Item value="option-b">Option B</Menu.Item>
          <Menu.Divider />
          <Menu.Item value="option-c">Option C</Menu.Item>
        </Menu.List>
      </>
    )}
  </Menu>
)

export const Stretched: StoryFn<MenuProps> = (args) => (
  <Menu {...args} isStretch>
    {({ isOpen }) => (
      <>
        <Menu.Button isOpen={isOpen} isStretch>
          Full width
        </Menu.Button>
        <Menu.List>
          <Menu.Item value="one">One</Menu.Item>
          <Menu.Item value="two">Two</Menu.Item>
        </Menu.List>
      </>
    )}
  </Menu>
)

export const DisabledItem: StoryFn<MenuProps> = (args) => (
  <Menu {...args}>
    {({ isOpen }) => (
      <>
        <Menu.Button isOpen={isOpen}>Open menu</Menu.Button>
        <Menu.List>
          <Menu.Item value="enabled">Enabled</Menu.Item>
          <Menu.Item value="disabled" disabled>
            Disabled
          </Menu.Item>
        </Menu.List>
      </>
    )}
  </Menu>
)
