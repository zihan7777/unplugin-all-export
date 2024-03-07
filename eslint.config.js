import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    rules: {
      'no-console': 'off',
      'antfu/if-newline': 'off',
      'style/brace-style': 'off',
      'style/arrow-parens': 'off',
    },
  },
)
