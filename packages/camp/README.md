# @opengovsg/design-system-react

This design system extends from the wonderful [Chakra UI library](https://github.com/chakra-ui/chakra-ui).

The available components can be viewed at our [Storybook](https://design.open.gov.sg)

## Installing the design system

ChakraUI is a peer dependency of this design system and should be installed alongside this package. The full list of peer dependencies can be found in the [package.json](package.json).

(You might find that you do not need to install some peer dependencies until you need them.)

```sh
$ npm install --save @opengovsg/design-system-react @chakra-ui/react
# or
$ yarn add @opengovsg/design-system-react @chakra-ui/react
```

# Getting set up

To start using the components, please follow these steps:

1. Wrap your application in a `ThemeProvider` provided by **@opengovsg/design-system-react**.

There is also an optional (though strongly recommended) font package [inter-ui](https://www.npmjs.com/package/inter-ui) that provides the font that is used throughout the design system.
If using `code` fonts, the [IBM Plex Mono](https://www.npmjs.com/package/@fontsource/ibm-plex-mono) package is also recommended.

This CSS file(s) should be imported in the root of your application **once**:

```jsx
import 'inter-ui/inter.css' // Strongly recommended.
import '@fontsource/ibm-plex-mono' // Import if using code textStyles.

import { ThemeProvider } from '@opengovsg/design-system-react'

const App = ({ children }) => (
  <ThemeProvider>
    <ColorModeProvider>{children}</ColorModeProvider>
  </ThemeProvider>
)
```

`ColorModeProvider` is a context that provides light mode and dark mode values
to the components. It also comes with a function to toggle between light/dark
mode.

However, this design system current **does not** support dark mode for now, and as such do not recommend using `ColorModeProvider`.

3. Now you can start using components like so:

```jsx
import { Button } from '@opengovsg/design-system-react'

const App = () => <Button>Click me</Button>
```

This design system does not provide the full range of components that ChakraUI provides. As such, consume components from the [Chakra UI](https://chakra-ui.com) library as needed. They should work in synergy.

```jsx
import { Box } from '@chakra-ui/react'
import { Button } from '@opengovsg/design-system-react'

const Example = () => (
  <Box>
    <Button>Will work side by side with ChakraUI</Button>
  </Box>
)
```

## Adding types for TypeScript

Using [`@chakra-ui/cli`](https://www.npmjs.com/package/@chakra-ui/cli), you can also generate types for the design system to provide autocomplete for your TypeScript code.

If you are extending the theme (you used `extendTheme`):

```bash
npx @chakra-ui/cli tokens <path/to/your/theme.(js|ts)>
```

If generating for the base design system:

```bash
npx chakra-cli tokens node_modules/@opengovsg/design-system-react/build/main/theme/theme.js
```

> Note 🚨: If you delete the node_modules directory, you'll need to re-run the command to get proper typings again.

For convenience, you can add a postinstall script to your package.json, so you don't have to think about this every time you re-install your dependencies.

```json
"scripts": {
  "gen:theme-typings": "chakra-cli tokens node_modules/@opengovsg/design-system-react/build/main/theme/theme.js",
  "postinstall": "npm run gen:theme-typings"
}
```

## Common problems

````

### I am seeing

```bash
Module not found: Can't resolve 'libphonenumber-js/examples.mobile.json'
````

> `libphonenumber-js` is a peer dependency of this design system, and version 8 is automatically installed if your `npm` version is >= 7

If you're on npm version 4 to 6, install `libphonenumber-js` explicitly by executing the following command.

```bash
$ npm install libphonenumber-js
```

### I am seeing

When running your build script with `tsc`:

```bash
./../node_modules/@chakra-ui/theme/dist/index.d.ts:1636:25 - error TS2411: Property '_dark' of type 'undefined' is not assignable to 'string' index type 'string'.

1636                         _dark?: undefined;
                             ~~~~~

../../node_modules/@chakra-ui/theme/dist/index.d.ts:1637:25 - error TS2411: Property 'opacity' of type 'undefined' is not assignable to 'string' index type 'string'.

1637                         opacity?: undefined;
                             ~~~~~~~

../../node_modules/@chakra-ui/theme/dist/index.d.ts:1638:25 - error TS2411: Property 'cursor' of type 'undefined' is not assignable to 'string' index type 'string'.

1638                         cursor?: undefined;
                             ~~~~~~
```

To fix this, ensure that `skipLibCheck` is set to `false` in your `tsconfig.json`

## Publishing a new version

Releases use [Changesets](https://github.com/changesets/changesets), following
[OUI's release workflow](https://github.com/opengovsg/oui-design-system/blob/main/.github/workflows/publish-npm.yml).
Run commands from the repository root.

For each user-facing change, run `pnpm changeset`, select
`@opengovsg/design-system-react`, choose a patch, minor, or major bump, and write a
short release note. Commit the generated `.changeset/*.md` file with your change.
Documentation and tooling-only changes do not need a changeset.

After changes merge to `main`, the **Publish (Camp)** workflow opens or updates a
release PR with the package version, changelog, and root `pnpm-lock.yaml`.
Review and merge that PR to build and publish to npm (`latest`) and GitHub
Packages, and create a GitHub release. Already published versions are skipped,
so a failed GitHub Packages publish can be retried by rerunning the workflow.
The token generator is private and is never published.

For a test release, manually run **Publish (Camp)** on `main` with **Create
snapshot release** enabled. Pending changesets are released under the `snapshot`
tag in both registries, without committing version changes or consuming the
changesets on `main`. A snapshot requires a pending changeset. Install it with
`npm install @opengovsg/design-system-react@snapshot`.

The former `alpha`, `beta`, and `latest` branch publishing workflow is retired;
use release PRs and snapshots instead of `npm version`, manual tags, or merging
release branches back into `main`.

### Repository setup

- Enable **Allow GitHub Actions to create and approve pull requests** in
  **Settings → Actions → General**. The workflow uses `GITHUB_TOKEN` to create
  release PRs, tags, releases, and publish to GitHub Packages.
- Keep npm trusted publishing configured for `opengovsg/camp-design-system` and
  `.github/workflows/publish-camp.yml`. The workflow uses pnpm 12 with OIDC;
  no npm publishing token is needed.
- If required checks do not run on a bot-created release PR, close and reopen
  the PR to trigger them before merging.

## Further reading

As this design system is built on top of ChakraUI, it is (hopefully) fully compatible with ChakraUI's usage. Read [ChakraUI's documentation](https://chakra-ui.com) for all the available props and usage examples.
