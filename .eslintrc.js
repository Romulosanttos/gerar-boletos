module.exports = {
  env: {
    node: true,
    es2020: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script', // CommonJS para compatibilidade
  },
  rules: {
    // 🚨 Regras básicas para código legado
    'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
    'no-console': 'off', // Permitido em CLI tools
    'no-var': 'warn',    // Migração gradual
    'prefer-const': 'warn',
    'no-undef': 'error',
    'no-redeclare': 'error',
    'no-unreachable': 'error',
    
    // 🏗️ Formatação básica
    'indent': ['warn', 2],
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single'],
    'comma-dangle': ['warn', 'never'],
    
    // 🛡️ Segurança mínima
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'tmp/',
    'coverage/',
    '*.min.js'
  ]
};