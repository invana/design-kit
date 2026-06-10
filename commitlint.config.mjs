// Enforces Conventional Commits on every commit via the .husky/commit-msg hook.
// These prefixes feed the git-cliff changelog (see cliff.toml) — feat/fix/perf/
// refactor/docs are rendered into CHANGELOG.md; test/chore/ci/build/style are
// valid but intentionally omitted from the changelog.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Restrict types to the set our cliff.toml understands.
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'refactor', 'docs', 'test', 'chore', 'ci', 'build', 'style', 'revert', 'release'],
    ],
  },
};
