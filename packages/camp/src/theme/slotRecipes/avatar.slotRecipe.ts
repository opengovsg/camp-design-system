import { defineSlotRecipe } from '@chakra-ui/react'

export type AvatarColorPalette =
  | 'main'
  | 'sub'
  | 'critical'
  | 'warning'
  | 'success'

/**
 * @deprecated Renamed to `AvatarColorPalette`. Will be removed in v3.
 */
export type ThemeAvatarColorScheme = AvatarColorPalette

/**
 * Avatar slot recipe — overrides only the properties v1 diverged on. The rest
 * (root layout, image cover, fallback layout, group borders, shape variants)
 * comes from v3's default `avatarSlotRecipe` via `createSystem` deep merge.
 *
 * v1 component: `git show main:packages/camp/src/theme/components/Avatar.ts`.
 * v1 had no React wrapper — only this theme-level override.
 *
 * v1 differences from v3 defaults:
 * - Variant default is `solid` (v3 default is `subtle`).
 * - `subtle` variant uses brand `*-subtle.default` bg + brand-coloured fg,
 *   not v3's `colorPalette.muted` (which is undefined on our brand palettes).
 * - `solid` variant uses brand `solid` bg + `fg` (= white or `#1F1F1F`), not
 *   v3's `colorPalette.contrast`.
 * - Size `2xs` is `1.25rem` (v3 default is `sizes.6` = `1.5rem`).
 * - Per-size text is driven by our textStyles (`legal`, `caption-1`,
 *   `subhead-2`) rather than v3's `fontSizes.<key>`.
 *
 * Per audit § 8 #14: v3-default size variants set CSS variables
 * (`--avatar-size`, `--avatar-font-size`) which beat our base. We redeclare
 * `--avatar-size` and set `textStyle` in each size variant so v1 dimensions
 * and typography win after merge.
 *
 * Per audit § 8 #16: no `className` field is set; v3 defaults to
 * `chakra-avatar`.
 */
export const avatarSlotRecipe = defineSlotRecipe({
  slots: ['root', 'image', 'fallback'],
  base: {
    root: {
      // `bg` and `color` are set in each `variant.*` block (v1 had no base
      // bg/color — colour came entirely from variant + colorPalette).
      // `borderRadius` is set by v3's `shape` variant via `--avatar-radius`;
      // we keep v3's `shape: 'full'` default → circular.
      //
      // v1 (via Chakra v2's default Avatar theme) rendered fallback initials
      // as uppercased, center-aligned text. v3 dropped both. Set on `root`
      // so they're observable on the avatar element (text-transform/align
      // inherit to the fallback slot child).
      textTransform: 'uppercase',
      textAlign: 'center',
      // v1 Avatar (chakra v2 default) had `border: 2px solid white` on every
      // avatar so overlapping avatars in an `AvatarGroup` showed white
      // separators. v3 only applies the border on `&[data-group-item]`, which
      // means a standalone Avatar drops the white outline our v1 design relied
      // on. Restore it on root so the bordered look survives outside groups
      // and the group-item case (which keeps `borderColor: bg` from v3) still
      // matches white once `bg` resolves to `base.canvas.default`.
      borderColor: 'white',
    },
    fallback: {
      // v1 set `fontWeight: medium` per-size via textStyle (subhead-2 etc.).
      // v3 default also sets `fontWeight: medium` on fallback — match it
      // explicitly so the textStyle's inlined fontWeight is consistent.
      fontWeight: 'medium',
    },
  },
  variants: {
    size: {
      // Each size redeclares `--avatar-size` and `textStyle` on the root,
      // because v3's default `size.X.root` sets these as CSS variables that
      // would otherwise beat our base. The textStyle inlines fontSize /
      // lineHeight / letterSpacing matching v1's per-size typography.
      '2xs': {
        root: {
          '--avatar-size': '1.25rem',
          textStyle: 'legal',
        },
      },
      xs: {
        root: {
          '--avatar-size': '2rem',
          textStyle: 'caption-1',
        },
      },
      sm: {
        root: {
          '--avatar-size': '2.25rem',
          textStyle: 'caption-1',
        },
      },
      md: {
        root: {
          '--avatar-size': '2.5rem',
          textStyle: 'subhead-2',
        },
      },
      // lg/xl/2xl inherit v3 defaults; v1 had no explicit size overrides for
      // these — only badge-placement (the v3 Avatar has no badge slot).
    },
    variant: {
      solid: {
        root: {
          bg: 'colorPalette.solid',
          color: 'colorPalette.fg',
        },
      },
      subtle: {
        root: {
          // `subtleBg` / `subtleFg` are per-palette semantic tokens added to
          // `semanticTokens/colors.ts` for the avatar's subtle variant
          // (v1 used `interaction.${c}-subtle.default` bg + `${c}.default` fg).
          // v3's default `subtle` references `colorPalette.muted` which is
          // undefined on our brand palettes.
          bg: 'colorPalette.subtleBg',
          color: 'colorPalette.subtleFg',
        },
      },
    },
  },
  defaultVariants: {
    // `defaultVariants.colorPalette` is rejected by `defineSlotRecipe` types
    // (audit § 8 #2). Consumers must pass `colorPalette="main"` or rely on
    // `globalCss.html.colorPalette: 'gray'` (v3 default).
    size: 'md',
    variant: 'solid',
  },
})
