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
      'no-restricted-syntax': 'off',
      '@cspell/spellchecker': 'off',
      'e18e/ban-dependencies': 'off',
    },
  },
]
