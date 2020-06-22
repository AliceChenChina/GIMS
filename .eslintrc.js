module.exports = {
  // “off” 或 0 - 关闭规则
  // “warn” 或 1 - 开启规则
  // “error” 或 2 - 开启规则
  root: true,

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: [
    'standard',
    'plugin:vue/recommended'
  ],

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  rules: {
    eqeqeq: 2, // 必须全等
    indent: 'off',
    'no-debugger': 0,
    'no-console': [ // 是否允许代码中存在console
      0
    ],
    'linebreak-style': [ // 换行模式，建议用unix
      'error',
      'unix'
    ],
    quotes: [ // 强制使用单引号
      'error',
      'single'
    ],
    'space-before-function-paren': ['error', 'never'], // 函数参数（前面没有空格，后面必须跟一个空格
    semi: [2, 'always'], // 强制分号
    'no-useless-escape': 0,
    'lines-between-class-members': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    'vue/no-unused-vars': 0,
    'vue/valid-v-for': 0,
    'vue/html-self-closing': 0,
    'vue/no-v-html': 0,
    'vue/attribute-hyphenation': 0,
    'vue/order-in-components': 0,
    // 设置script标签下首行缩进
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1
      }
    ]
  },
  'extends': [
    'standard',
    'plugin:vue/recommended',
    '@vue/typescript'
  ]
};
