import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  ...config.recommendedNode,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'jest/no-restricted-jest-methods': 'off',
      'n/no-missing-import': 'off',
      'no-restricted-syntax': 'off',
      'sonarjs/no-trivial-assertions': 'off',
      'unicorn/no-global-object-property-assignment': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
      'unicorn/no-unnecessary-global-this': 'off',
      'unicorn/prefer-await': 'off',
      '@cspell/spellchecker': 'off',
    },
  },
  {
    rules: {
      'e18e/ban-dependencies': 'off',
    },
  },
]
