#!/usr/bin/env bash
#
# release.sh — cut a lockstep release of all @invana/* packages.
#
# All publishable packages share ONE version. This script bumps every
# package.json under packages/* to the given version, regenerates
# CHANGELOG.md with git-cliff, commits both, and tags the commit. Pushing
# the tag triggers the "Release" GitHub Action
# (.github/workflows/release.yml), whose jobs publish to npm, push the
# releases/* branches, create the GitHub Release, and deploy Storybook.
#
# Because the version is written into package.json *before* the tag is
# created on that same commit, the git tag and the published version
# always match — no drift.
#
# Usage:
#   ./release.sh 0.2.0
#
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: ./release.sh <version>   e.g. ./release.sh 0.2.0"
  exit 1
fi

# Releases are cut from main with a clean working tree.
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "Error: releases must be cut from 'main' (you are on '$BRANCH')."
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree is not clean. Commit or stash your changes first."
  exit 1
fi

if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Error: tag v$VERSION already exists."
  exit 1
fi

echo "Bumping all packages/* to $VERSION ..."
# Bump only the version field in each package's package.json. Cross-package
# workspace:* deps are left as-is; pnpm rewrites them to ^$VERSION at publish.
pnpm -r --filter "./packages/*" exec npm version "$VERSION" --no-git-tag-version

echo "Regenerating CHANGELOG.md ..."
# The version being cut is not tagged yet, so --tag tells git-cliff what to call
# the section for the commits since the last tag. The whole file is rebuilt from
# history, which also restores any section that was never written.
# cliff.toml is the single source of truth for what appears here.
pnpm exec git-cliff --tag "v$VERSION" -o CHANGELOG.md

# -a picks up both the bumped package.json files and CHANGELOG.md, so the tag
# below lands on a commit that already carries its own changelog entry.
git commit -am "release: v$VERSION"
# Annotated tag so `git push --follow-tags` will push it (lightweight tags are skipped).
git tag -a "v$VERSION" -m "v$VERSION"

echo
echo "Created commit + tag v$VERSION."
echo "Push to publish:"
echo
echo "    git push origin main --follow-tags"
echo
echo "The tag push triggers the 'Release' workflow — one run, all stages."
