import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  rules: {
    'no-console': 'off',
    'style/comma-dangle': ['error', 'never'],
    'unused-imports/no-unused-imports': ['error', 'all'],

    '@typescript-eslint/no-namespace': 'off',
    'e18e/prefer-static-regex': ['warn']
  }
})
