# Contributing

Invana Design Kit is a pnpm + Turborepo monorepo. See [`CLAUDE.md`](./CLAUDE.md) for
the full architecture, workspace layout, and conventions.

## Development

```bash
pnpm install        # install all workspace deps
pnpm dev            # run all dev tasks
pnpm --filter @invana/stoybook dev   # Storybook on port 6009
pnpm build          # build every package (dependency order)
pnpm lint           # lint
pnpm check-types    # type-check
```

## Releasing to npm

All publishable packages — `@invana/styling`, `@invana/ui`, `@invana/forms`,
`@invana/tables`, `@invana/themes` — are released **in lockstep**: they always
share the same version, cut with a single git tag.

### How it works

The version lives in each `package.json`. A git tag is just a label on a commit.
To keep them in sync, [`release.sh`](./release.sh) bumps every `package.json`
**first**, commits, then tags that same commit. Pushing the tag triggers the
[`Publish to npm`](./.github/workflows/release-npm.yml) GitHub Action, which
builds and publishes. Because the version is committed before the tag exists, the
tag and the published version can never drift.

> Cross-package `workspace:*` dependencies are left untouched in source —
> `pnpm publish` rewrites them to the real version (`^x.y.z`) at publish time.

### Cutting a release

From a clean `main`:

```bash
./release.sh 0.2.0          # bumps all packages to 0.2.0, commits, tags v0.2.0
git push origin main --follow-tags
```

The tag push starts the workflow. Watch it under the repo's **Actions** tab.
Once green, the packages are live on npm and a **GitHub Release** is created for
the tag with auto-generated notes (the commits/PRs merged since the previous
`v*` tag). Edit the release on GitHub afterward if you want to polish the notes.

### One-time setup (maintainers)

The publish workflow authenticates with an npm **automation access token** stored
as a GitHub repository secret:

1. Create the token at npm → **Access Tokens** → *Generate New Token* →
   **Automation** (or a Granular token scoped to the `@invana` packages with
   read/write).
2. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, name it **`NPM_TOKEN`**, paste the token.

The `@invana` org must exist on npm and you must be a member with publish rights.
Never commit a token or paste it into chat — it only belongs in the GitHub secret.

### Publishing locally (fallback)

If you ever need to publish from your machine instead of CI:

```bash
npm login
pnpm build
pnpm -r publish --access public
```

## Notes

- This npm pipeline is separate from the git-branch release workflows
  (`release-ui`, `release-styling`, `release-themes`) that push built artifacts
  to `releases/*` branches. Both can coexist.
- Do not commit unless a change is ready; do not create release tags for
  work-in-progress.
