module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    // parser: 'babel-eslint'
    ecmaVersion: 2018,
  },
  extends: [
    '@nuxtjs',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['sort-class-members'],
  // add your custom rules here
  rules: {
    // prettier
    'prettier/prettier': [
      'error',
      {
        semi: false,
        tabWidth: 2,
        arrowParens: 'always',
        singleQuote: true,
        trailingComma: 'es5',
        htmlWhitespaceSensitivity: 'ignore',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    camelcase: 'off',
    semi: ['error', 'never'],
    'standard/no-callback-literal': 0,
    'no-useless-constructor': 'off',
    '@typescript-eslint/member-ordering': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
}
