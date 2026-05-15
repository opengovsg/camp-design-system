import { useState } from 'react'
import { List, Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Badge } from '~/Badge'
import { BxLockAlt, BxMailSend } from '~/icons'

import { Tile, type TileProps } from './'

export default {
  title: 'Components/Tiles',
  component: Tile,
  tags: ['autodocs'],
} as Meta<TileProps>

const StorybookListChildrenExample = ({
  listTitle,
  listItems = [],
}: {
  listTitle: string
  listItems: string[]
}) => (
  <>
    <Tile.Text textStyle="subhead-2">{listTitle}</Tile.Text>
    <List.Root>
      {listItems.map((text, i) => (
        <List.Item textStyle="body-2" textAlign="left" key={i}>
          <Tile.Text>{text}</Tile.Text>
        </List.Item>
      ))}
    </List.Root>
  </>
)

interface TileTemplateProps extends Omit<TileProps, 'children'> {
  title?: string
  subtitle?: string
  listTitle?: string
  listItems?: Record<string, string>
}

const Template: StoryFn<TileTemplateProps> = ({
  title = 'Tile title',
  subtitle = 'Tile subtitle',
  listTitle,
  listItems,
  ...args
}) => {
  const [isClicked, setIsClicked] = useState(false)
  const hasDescription = !!(listTitle || listItems)
  return (
    <Tile
      {...args}
      onClick={() => setIsClicked(!isClicked)}
      isSelected={isClicked}
    >
      <Tile.Title>{title}</Tile.Title>
      <Tile.Subtitle>{subtitle}</Tile.Subtitle>
      {hasDescription && (
        <StorybookListChildrenExample
          listTitle={listTitle ?? ''}
          listItems={Object.values(listItems ?? {})}
        />
      )}
    </Tile>
  )
}

export const Simple = Template.bind({})
Simple.args = {
  variant: 'simple',
  title: 'Simple',
  subtitle: 'Receive responses in forms',
  icon: BxMailSend,
}

export const Complex = Template.bind({})
Complex.args = {
  variant: 'complex',
  title: 'Complex',
  subtitle: 'Receive responses in forms',
  icon: BxLockAlt,
  badge: <Badge colorPalette="success">recommended</Badge>,
  listTitle: 'description',
  listItems: {
    a: 'High-volume forms',
    b: 'End to end encryption needs',
  },
}

interface StoryTileProps {
  onClick: () => void
  isSelected?: boolean
}

const EmailTile = ({ onClick, isSelected }: StoryTileProps) => (
  <Tile
    variant="complex"
    icon={BxMailSend}
    isSelected={isSelected}
    onClick={onClick}
    flex={1}
  >
    <Tile.Title>Email Mode</Tile.Title>
    <Tile.Subtitle>Receive responses in your inbox</Tile.Subtitle>
    <StorybookListChildrenExample
      listTitle="Who is it for:"
      listItems={['Emailed copy of response', 'MyInfo fields']}
    />
  </Tile>
)

const StorageTile = ({ onClick, isSelected }: StoryTileProps) => (
  <Tile
    variant="complex"
    icon={BxLockAlt}
    badge={<Badge colorPalette="success">recommended</Badge>}
    isSelected={isSelected}
    onClick={onClick}
    flex={1}
  >
    <Tile.Title>Storage Mode</Tile.Title>
    <Tile.Subtitle>Receive responses in Form</Tile.Subtitle>
    <StorybookListChildrenExample
      listTitle="Who is it for:"
      listItems={['High-volume forms', 'End to end encryption needs']}
    />
  </Tile>
)

export const Playground: StoryFn = () => {
  const [selected, setSelected] = useState<'email' | 'storage' | null>(null)
  return (
    <Stack direction="row" gap="1rem">
      <StorageTile
        onClick={() => setSelected('storage')}
        isSelected={selected === 'storage'}
      />
      <EmailTile
        onClick={() => setSelected('email')}
        isSelected={selected === 'email'}
      />
    </Stack>
  )
}
