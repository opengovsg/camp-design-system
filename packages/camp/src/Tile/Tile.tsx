import {
  type ComponentPropsWithoutRef,
  createContext,
  type ElementType,
  forwardRef,
  useContext,
  useMemo,
} from 'react'
import {
  chakra,
  HStack,
  Icon,
  Text,
  type TextProps,
  useSlotRecipe,
} from '@chakra-ui/react'

import type { TileVariant } from '~/theme/slotRecipes/tile.slotRecipe'

type TileStyles = ReturnType<ReturnType<typeof useSlotRecipe>>

const TileStylesContext = createContext<TileStyles | null>(null)
const useTileStyles = () => {
  const styles = useContext(TileStylesContext)
  if (!styles) {
    throw new Error('Tile sub-components must be used within a <Tile>')
  }
  return styles
}

export interface TileProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'title'> {
  /** Icon to render in the tile header. */
  icon?: ElementType
  children: React.ReactNode
  /** Optional badge rendered next to the icon. */
  badge?: JSX.Element
  variant?: TileVariant
  /** Whether the tile is in the selected (pressed) state. */
  isSelected?: boolean
}

const TileTitle = (props: TextProps) => {
  const styles = useTileStyles()
  return <Text css={styles.title} {...props} />
}
TileTitle.displayName = 'Tile.Title'

const TileSubtitle = (props: TextProps) => {
  const styles = useTileStyles()
  return <Text css={styles.subtitle} {...props} />
}
TileSubtitle.displayName = 'Tile.Subtitle'

const TileText = (props: TextProps) => {
  const styles = useTileStyles()
  return <Text css={styles.text} {...props} />
}
TileText.displayName = 'Tile.Text'

const TileInner = forwardRef<HTMLButtonElement, TileProps>(
  (
    { badge, icon, children, variant = 'simple', isSelected, ...props },
    ref,
  ) => {
    const recipe = useSlotRecipe({ key: 'tile' })
    const styles = useMemo(() => recipe({ variant }), [recipe, variant])

    return (
      <TileStylesContext.Provider value={styles}>
        <chakra.button
          ref={ref}
          type="button"
          css={styles.container}
          data-selected={isSelected || undefined}
          aria-pressed={isSelected}
          {...props}
        >
          <HStack gap="1rem">
            {icon && <Icon css={styles.icon} as={icon} />}
            {badge}
          </HStack>
          {children}
        </chakra.button>
      </TileStylesContext.Provider>
    )
  },
)
TileInner.displayName = 'Tile'

export const Tile = Object.assign(TileInner, {
  Title: TileTitle,
  Subtitle: TileSubtitle,
  Text: TileText,
})
