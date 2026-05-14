import { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

import { system } from './system'

export interface ThemeProviderProps {
  children?: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
)
