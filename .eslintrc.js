module.exports = {
  root: true,
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: [
    'jsx-a11y', //
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin', //
          'external',
          'internal',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-dom',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
  },
};
