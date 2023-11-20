module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: 0,
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
    'comma-dangle': 'off',
    'no-underscore-dangle': 'off', 
    'max-classes-per-file': 'off'
  },
};
