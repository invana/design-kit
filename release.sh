#!/usr/bin/env bash
#
# release.sh — cut a lockstep release of all @invana/* packages.
#
# All publishable packages share ONE version. This script bumps every
# package.json under packages/* to the given version, commits, and tags
# the commit. Pushing the tag triggers the "Publish to npm" GitHub Action
# (.github/workflows/release-npm.yml), which builds and publishes to npm.
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

git commit -am "release: v$VERSION"
# Annotated tag so `git push --follow-tags` will push it (lightweight tags are skipped).
git tag -a "v$VERSION" -m "v$VERSION"

echo
echo "Created commit + tag v$VERSION."
echo "Push to publish:"
echo
echo "    git push origin main --follow-tags"
echo
echo "The tag push triggers the 'Publish to npm' workflow."
