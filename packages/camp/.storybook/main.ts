import path from 'path'
import type { UserConfig } from 'vite'
import type { StorybookConfig } from '@storybook/react-vite';

import { dirname } from 'node:path';

const getAbsolutePath = (packageName: string) =>
  dirname(require.resolve(path.join(packageName, 'package.json')));
export default {
  features: {},
  stories: [
    './introduction/Welcome/Welcome.stories.tsx',
    './introduction/Principles/Principles.stories.tsx',
    './foundations/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-interactions',
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  staticDirs: ['./static'],
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config: UserConfig) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      resolve: {
        alias: {
          '~': path.resolve(__dirname, '../src/'),
        },
      },
    })
  },
  refs: {
    // Prevent Chakra-UI's design systems from being linked
    '@chakra-ui/react': {
      disable: true,
    },
  },
  docs: {
    autodocs: 'tag',
  },
} satisfies StorybookConfig
