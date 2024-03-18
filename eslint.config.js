import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['test/**/*', '*.md'],
  },
  {
    rules: {
      'array-callback-return': 'off',
      'no-template-curly-in-string': 'off',
      'no-console': 'off',
      'antfu/if-newline': 'off',
      'style/brace-style': 'off',
      'style/arrow-parens': 'off',
    },
  },
)
