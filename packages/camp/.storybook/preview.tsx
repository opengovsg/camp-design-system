import '@fontsource/ibm-plex-mono'
import 'inter-ui/inter.css'

import type { Preview } from '@storybook/react'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'

import { ThemeProvider } from '../src/theme'

import { StorybookTheme } from './themes'

const backgrounds = {
  light: { name: 'light', value: '#FFFFFF' },
  dark: { name: 'dark', value: '#3d3d3d' },
}

export const parameters: Preview['parameters'] = {
  docs: {
    theme: StorybookTheme.docs,
    inlineStories: true,
    source: { excludeDecorators: true },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    values: [
      ...Object.values(backgrounds),
      { name: 'blue', value: '#1361F0' },
    ],
  },
}

const withTheme = withThemeFromJSXProvider({
  themes: { default: {} },
  defaultTheme: 'default',
  Provider: ThemeProvider,
})

export const decorators = [withTheme]
