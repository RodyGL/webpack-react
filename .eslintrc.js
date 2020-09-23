module.exports = {
  root: true,
  extends: [
    'react-app',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['jsx-a11y'],
      extends: [
        'react-app',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/react',
      ],
      rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],

        'jsx-a11y/no-autofocus': [
          'error',
          {
            ignoreNonDOM: true,
          },
        ],

        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/triple-slash-reference': [
          'error',
          { path: 'always', types: 'always', lib: 'always' },
        ],
      },
    },
  ],
  rules: {
    'object-shorthand': ['error', 'always'],

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
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
