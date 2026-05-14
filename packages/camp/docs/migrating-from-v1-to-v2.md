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

| v1 name | v2 name | Status |
|---|---|---|
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

### Status of components in this package

This release (v2.0.0) ships:

- `Button` (migrated)
- `Spinner` (migrated)
- `ThemeProvider`, `system`, theme tokens (migrated)
- Icons (`Bx*`, minus the two animated-icon helpers retired in this release)

Other components from v1 are not yet available in v2. They will land in
subsequent v2.x releases on a rolling basis. Refer to `CHANGELOG.md` for the
current matrix.
