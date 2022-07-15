const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const dxMock = require('dx-mock')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UnusedWebpackPlugin = require('unused-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'main.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx'],
    alias: {
      '@constants': resolve('constants'),
      '@utils': resolve('utils'),
      '@components': resolve('components'),
      '@decorators': resolve('decorators'),
    }
  },
  module: {
    rules: rules.concat([
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.join(__dirname, 'postcss.config.js')
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|theme|xbee|xpanda)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.join(__dirname, 'postcss.config.js')
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                relativeUrls: false,
                math: 'always',
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /(theme|xbee|xpanda)\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
    ])
  },
  plugins: [
    new UnusedWebpackPlugin({
      directories: [
        path.join(__dirname, '../src')
      ],
      exclude: [],
      root: path.join(__dirname, '..'),
    }),
    new HtmlWebpackPlugin({
      template: fs.existsSync(path.join(__dirname, '../template/index.dev.html')) ? 'template/index.dev.html' : 'template/index.html'
    }),
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      failOnError: true,
    }),
    new ReactRefreshWebpackPlugin(),
    new CaseSensitivePathsWebpackPlugin(),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new webpack.DefinePlugin({
      API_SERVER_PLACEHOLDER: JSON.stringify('')
    })
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, '../data'),
      },
      {
        directory: path.join(__dirname, '../build'),
      }
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    onBeforeSetupMiddleware: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      dxMock(devServer.app, { root: path.join(__dirname, '../api')})
    },
    proxy: {
      '/dev': {
        target: '',
        pathRewrite: { '^/dev': '' },
      },
    }
  }
}

function resolve(p) {
  return path.join(__dirname, '../src', p)
}
