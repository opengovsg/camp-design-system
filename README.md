# Open Government Products Design System

Exports components which follow the design and accessibility guidelines in the OGP design system.

Read the relevant READMEs in the respective subdirectories for more information.

Credit for design:

@f1zaz

@pearlyong

@NatMaeTan

## Development

Use Node.js 24. The repository pins pnpm 12.14.0 in `package.json`.
Install pnpm with `npm install --global pnpm@12.14.0` if needed.

Run these commands from the repository root:

```sh
pnpm install
pnpm --filter @opengovsg/design-system-react build
pnpm --filter @opengovsg/design-system-react lint
pnpm --filter @opengovsg/design-system-react storybook
```

Commit `pnpm-lock.yaml` when dependencies change. CI installs with
`pnpm install --frozen-lockfile`.
