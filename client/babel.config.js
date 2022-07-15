module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['> 1%', 'last 2 versions'],
        },
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: true,
            },
          },
        ],
        ['@babel/preset-react', {
          runtime: 'automatic'
        }],
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        [
          '@dr.pogodin/react-css-modules',
          {
            generateScopedName: '[hash:base64]',
            filetypes: {
              '.less': {
                syntax: 'postcss-less',
              },
            },
          },
        ],
      ],
    },
    development: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        'react-refresh/babel',
        [
          '@dr.pogodin/react-css-modules',
          {
            webpackHotModuleReloading: true,
            handleMissingStyleName: 'warn',
            generateScopedName: '[path][name]__[local]--[hash:base64:5]',
            filetypes: {
              '.less': {
                syntax: 'postcss-less',
              },
            },
          },
        ],
      ],
    },
    production: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        [
          '@dr.pogodin/react-css-modules',
          {
            generateScopedName: '[hash:base64]',
            filetypes: {
              '.less': {
                syntax: 'postcss-less',
              },
            },
          },
        ],
      ],
    },
  },
}
