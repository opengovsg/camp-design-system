# Migrating @opengovsg/design-system-react v1 → v2

v2.0.0 of this package is built on Chakra UI v3, a major rewrite of Chakra UI.
Most consumer code that used Chakra v2 APIs needs to be updated.

This guide focuses on what _this package_ changes. Refer to the
[official Chakra UI v3 migration guide](https://chakra-ui.com/docs/get-started/migration)
for general v2 → v3 changes.

## Quick start

1. Update peer deps:

   ```bash
   npm install @chakra-ui/react@^3 @opengovsg/design-system-react@^2
   npm uninstall @emotion/styled framer-motion @chakra-ui/cli
   npm install -D @chakra-ui/cli@^3
   ```

2. Run Chakra's automated codemod against your app code:

   ```bash
   npx @chakra-ui/codemod upgrade
   ```

   This handles most prop renames and component restructuring automatically.
   Run with `--dry` first to preview.

3. Update your theme typegen command (if you use one):

   ```diff
   - chakra-cli tokens ./node_modules/@opengovsg/design-system-react/build/main/theme/theme.js
   + chakra typegen ./node_modules/@opengovsg/design-system-react/build/main/theme/system.js
   ```

## Breaking changes specific to this package

### `ThemeProvider` no longer accepts `theme` or `portalZIndex`

The provider now reads the v3 `system` internally; consumers don't pass a
theme. `portalZIndex={40}` was dropped — Chakra v3 handles portals
differently. If you previously relied on the v1 default of `40`, pass `zIndex`
to specific `Portal` usages where layering matters.

```diff
- <ThemeProvider portalZIndex={40}>
+ <ThemeProvider>
```

### `colorScheme` → `colorPalette`

Every component prop named `colorScheme` is now `colorPalette`. The codemod
handles this automatically.

```diff
- <Button colorScheme="main">Click me</Button>
+ <Button colorPalette="main">Click me</Button>
```

### Component renames (deprecated aliases included)

The following v1 export names are still importable in v2.x for migration ease,
but are marked `@deprecated` and will be removed in v3.0.

| v1 name                         | v2 name              | Status                                    |
| ------------------------------- | -------------------- | ----------------------------------------- |
| `ThemeButtonColorScheme` (type) | `ButtonColorPalette` | `ThemeButtonColorScheme` deprecated alias |

(More entries land as follow-up component migrations ship. Check `CHANGELOG.md`
for the full list as each release goes out.)

### Compound APIs

Many components now use compound (dot-notation) APIs. Where this package had
v1 wrappers (e.g. `Modal`, `Drawer`), v2 exposes Chakra v3's compound shape
directly:

```diff
- <Modal isOpen={isOpen} onClose={onClose}>
-   <ModalOverlay />
-   <ModalContent>
-     <ModalHeader>Title</ModalHeader>
-     <ModalBody>Content</ModalBody>
-   </ModalContent>
- </Modal>
+ <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
+   <Dialog.Backdrop />
+   <Dialog.Positioner>
+     <Dialog.Content>
+       <Dialog.Header>Title</Dialog.Header>
+       <Dialog.Body>Content</Dialog.Body>
+     </Dialog.Content>
+   </Dialog.Positioner>
+ </Dialog.Root>
```

Chakra's codemod restructures most of these automatically.

### Prop renames

Standard v3 boolean-prop renames apply across all components:

- `isOpen` → `open`
- `isDisabled` → `disabled`
- `isLoading` → `loading`
- `isChecked` → `checked`
- `isInvalid` → `invalid`
- `isReadOnly` → `readOnly`
- `isRequired` → `required`
- `isActive` → `data-active` (as an attribute for forcing the active state)

### Button: icon props become children

```diff
- <Button leftIcon={<BxUpload />} iconSpacing={2}>Upload</Button>
+ <Button gap={2}><BxUpload /> Upload</Button>
```

### `sx` → `css` with `&` selector

```diff
- <Box sx={{ svg: { color: 'red.500' } }} />
+ <Box css={{ '& svg': { color: 'red.500' } }} />
```

### Dropped runtime deps

- `@emotion/styled` no longer needed.
- `framer-motion` no longer needed.

## Extending the theme (custom palettes, variants, overrides)

v2 exposes the `config` (mergeable `defineConfig` output) so downstream apps
can add tokens/recipes/variants without recreating the system. There are two
patterns.

### Pattern A: pass `extendConfig` to `ThemeProvider`

The simplest path. Best for adding a custom palette, a custom variant, or
overriding a token globally for your app.

```tsx
import { defineConfig } from '@chakra-ui/react'
import { ThemeProvider } from '@opengovsg/design-system-react'

const tenantTheme = defineConfig({
  theme: {
    tokens: {
      colors: { tenantBrand: { value: '#ff8800' } },
    },
    semanticTokens: {
      colors: {
        // A new colorPalette with the four button slots the recipe expects.
        tenant: {
          solid: { value: '{colors.tenantBrand}' },
          solidHover: { value: '{colors.tenantBrand}' },
          solidActive: { value: '{colors.tenantBrand}' },
          fg: { value: '#ffffff' },
          outlineBorder: { value: '{colors.tenantBrand}' },
          reverseFg: { value: '{colors.tenantBrand}' },
        },
      },
    },
    recipes: {
      button: {
        variants: {
          variant: {
            tertiary: {
              bg: 'transparent',
              color: 'tenantBrand',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
})

export const App = () => (
  <ThemeProvider extendConfig={tenantTheme}>
    <YourApp />
  </ThemeProvider>
)
```

The merge order is `defaultConfig` → OGP config → your `extendConfig`. Your
values win on collision. Recipes deep-merge per-variant, so `tertiary`
above slots in next to OGP's `solid/reverse/outline/clear/link/inputAttached`
rather than replacing them.

### Pattern B: build your own `system` with `config`

Use when you need full control — e.g. multi-tenant apps that render
different `ChakraProvider`s per route, or when you want to layer multiple
configs in a specific order.

```tsx
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { config as ogpConfig } from '@opengovsg/design-system-react'

const mySystem = createSystem(
  defaultConfig,
  ogpConfig,
  defineConfig({
    /* your overrides */
  }),
)

export const App = () => (
  <ChakraProvider value={mySystem}>
    <YourApp />
  </ChakraProvider>
)
```

You bypass our `ThemeProvider` in this pattern.

### TypeScript autocomplete for custom variants

Custom variants you add via `extendConfig` won't appear in `<Button
variant="…">` autocomplete unless you regenerate types from your merged
system. Add a script that points `chakra typegen` at your assembled system
module and run it after installs.

```json
// package.json
{
  "scripts": {
    "gen:theme-types": "chakra typegen ./src/theme/system.ts",
    "postinstall": "npm run gen:theme-types"
  }
}
```

Without this step, your custom variant still renders correctly at runtime —
only the TypeScript value union is missing it.

> **Roadmap.** Manual `chakra typegen` wiring is the v2.0 starting point;
> the long-term plan is a companion code-gen package (e.g.
> `@opengovsg/design-system-codegen`) that takes a consumer's
> `defineConfig({...})`, layers it on the OGP base, and emits a fully-typed
> assembled `system` module + augmented type declarations as a single
> install-time / build-time step. The consumer would then just import the
> generated `system` and pass it to `ChakraProvider`, with autocomplete for
> every token / palette / variant — both ours and theirs — without any
> further configuration. This is tracked as a follow-up; once it lands, the
> `chakra typegen` script above will become unnecessary.

### What you can extend, and what you can't

| Action                                                           | Supported?                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Add a new `colorPalette` (with the slots our recipes reference)  | ✅                                                                       |
| Add a new variant to an existing recipe (e.g. `Button.tertiary`) | ✅                                                                       |
| Override an existing token value                                 | ✅                                                                       |
| Override an existing recipe variant's properties                 | ✅                                                                       |
| Add brand new recipes / slot recipes                             | ✅                                                                       |
| Remove a variant our recipe ships                                | ❌ (Chakra has no "delete variant" primitive; redefine the whole recipe) |
| Change variant identity (e.g. rename `solid` → `primary`)        | ❌ (same — full recipe redefinition needed)                              |

The `config` and individual recipes (e.g. `buttonRecipe`) are exported from
`@opengovsg/design-system-react`, so you can also clone-and-modify a specific
recipe if you need surgical control:

```ts
import { buttonRecipe } from '@opengovsg/design-system-react'
import { defineRecipe } from '@chakra-ui/react'

const myButtonRecipe = defineRecipe({
  ...buttonRecipe,
  variants: {
    ...buttonRecipe.variants,
    variant: {
      ...buttonRecipe.variants?.variant,
      // your additions / overrides
    },
  },
})
```

### Status of components in this package

This release (v2.0.0) ships:

- `Button` (migrated)
- `Spinner` (migrated)
- `ThemeProvider`, `system`, theme tokens (migrated)
- Icons (`Bx*`, minus the two animated-icon helpers retired in this release)

Other components from v1 are not yet available in v2. They will land in
subsequent v2.x releases on a rolling basis. Refer to `CHANGELOG.md` for the
current matrix.
