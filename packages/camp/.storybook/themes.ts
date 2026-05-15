import { create } from '@storybook/theming/create'

import PackageInfo from '../package.json'

// @ts-expect-error png module
import brandImage from './assets/restricted_ogp_logo.png'

type StorybookThemeShape = {
  manager: ReturnType<typeof create>
  docs: ReturnType<typeof create>
}

export const StorybookTheme: StorybookThemeShape = {
  manager: create({
    base: 'light',
    brandTitle: `OGP Design System@${PackageInfo.version}`,
    brandUrl: 'https://github.com/opengovsg/design-system',
    brandImage,
    // UI
    appBg: '#F7F9FE', // brand.primary.50
    appBorderColor: '#DADCE3',
    appBorderRadius: 0,
    // Typography
    fontBase: '"Inter", san-serif',
    // Text colours
    textColor: '#2E2E2E', // base.content.strong
    textInverseColor: '#FFFFFF',
    colorPrimary: '#276EF1', // interaction.main.default
    colorSecondary: '#276EF1', // interaction.main.default

    // Toolbar default and active colors
    barTextColor: '#2E2E2E', // base.content.strong
    barSelectedColor: '#276EF1', // interaction.main.default
  }),
  docs: create({
    base: 'light',
    fontBase: '"Inter", san-serif',
  }),
}
