const babelParser = require('@babel/eslint-parser')

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        Promise: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error'
    }
  }
]
