module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module'
    },
    globals: {
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
    },
    rules: {
      indent: ['warn',4],
      'linebreak-style': ['warn', 'unix'],
      quotes: ['off'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'] ,
      'no-undef': 'off'
    }
};
