module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/ban-types': ['off'],
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }], // 强制===，除非null
    'no-unused-vars': [
      1,
      {
        vars: 'all', // 禁止未使用过的变量
        args: 'none' // 不检查参数，参数可以声名但不使用
      }
    ]
  }
}
