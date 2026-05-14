import { ReactNode, useMemo } from 'react'
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  type SystemConfig,
} from '@chakra-ui/react'

import { config as baseConfig } from './config'
import { system as baseSystem } from './system'

export interface ThemeProviderProps {
  /**
   * Optional `defineConfig` output layered on top of the OGP design system's
   * theme. Use to add custom palettes, recipes, tokens, variants, or override
   * defaults without recreating the system from scratch.
   *
   * Note: custom variants added via `extendConfig` won't appear in TypeScript
   * autocomplete unless the consumer runs `chakra typegen` on their assembled
   * system. See the migration guide for setup.
   *
   * @example
   * ```tsx
   * import { defineConfig } from '@chakra-ui/react'
   * import { ThemeProvider } from '@opengovsg/design-system-react'
   *
   * const tenantTheme = defineConfig({
   *   theme: {
   *     tokens: { colors: { tenantBrand: { value: '#ff8800' } } },
   *     recipes: {
   *       button: {
   *         variants: {
   *           variant: { tertiary: { bg: 'tenantBrand', color: 'white' } },
   *         },
   *       },
   *     },
   *   },
   * })
   *
   * <ThemeProvider extendConfig={tenantTheme}>
   *   <App />
   * </ThemeProvider>
   * ```
   */
  extendConfig?: SystemConfig
  children?: ReactNode
}

export const ThemeProvider = ({
  extendConfig,
  children,
}: ThemeProviderProps) => {
  // No memoization cost when `extendConfig` is undefined — reuse the prebuilt
  // module-level `system`. `createSystem` only runs when consumers opt in.
  const system = useMemo(
    () =>
      extendConfig
        ? createSystem(defaultConfig, baseConfig, extendConfig)
        : baseSystem,
    [extendConfig],
  )

  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
