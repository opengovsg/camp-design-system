import '@fontsource/ibm-plex-mono'
import 'inter-ui/inter.css'

import { Decorator } from '@storybook/react'

import { ThemeProvider } from '../src/theme'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'

import { StorybookTheme } from './themes'
import { THEME_MAP } from './colorThemes'
import { ColorModeProvider } from '@chakra-ui/react'
import { get } from '@chakra-ui/utils'

const backgrounds = {
  light: {
    name: 'light',
    value: '#FFFFFF', // base.canvas.default
  },
  dark: {
    name: 'dark',
    value: '#3d3d3d', // base.canvas.inverse
  },
}

export const parameters = {
  docs: {
    theme: StorybookTheme.docs,
    inlineStories: true,
    source: {
      excludeDecorators: true,
    },
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
      {
        name: 'blue',
        value: '#1361F0',
      },
    ],
  },
}

const withTheme = withThemeFromJSXProvider({
  themes: THEME_MAP,
  defaultTheme: 'default',
  Provider: ThemeProvider,
})

const withColorMode: Decorator = (Story, context) => {
  const bgFromContext = get(context, 'globals.backgrounds.value')
  const bgFromDefault = get(context, 'parameters.backgrounds.default')
  let colorMode: 'dark' | 'light' = 'light'
  if (!bgFromContext && bgFromDefault) {
    if (['dark', 'light'].includes(context.parameters.backgrounds.default)) {
      colorMode = context.parameters.backgrounds.default as 'dark' | 'light'
    }
  } else {
    colorMode =
      context.parameters.colorMode ||
      get(context, 'globals.backgrounds.value') === backgrounds.dark.value
        ? 'dark'
        : 'light'
  }

  return (
    <ColorModeProvider value={colorMode}>
      <Story />
    </ColorModeProvider>
  )
}

export const decorators = [withColorMode, withTheme]
