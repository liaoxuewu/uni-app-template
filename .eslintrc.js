module.exports = {
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    globals: {
        uni: 'readonly',
        plus: 'readonly',
        rpx: 'readonly'
    },
    rules: {
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"]
    },
    env: {
        es6: true, browser: true, node: true
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    }
}
