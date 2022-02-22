module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts', '.js'],
            },
        },
    },
    rules: {
        'linebreak-style': 0,
        indent: ['error', 4],
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
        '@typescript-eslint/no-shadow': 'error',
        'object-curly-newline': 'off',
        'no-console': 'off',
    },
    ignorePatterns: ['__mocks__', '*.config.*'],
};
