// https://www.maizhiying.me/posts/2017/03/01/webpack-babel-ie8-support.html
const path = require('path')
const dayjs = require('dayjs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin')

const rules = require('./webpack.rules')
module.exports = {
  mode: 'production',
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'main.js',
    chunkFilename: '[name].[hash].js',
    clean: {
      keep: /vendor/
    }
  },
  optimization: {
    // chunkIds: 'named',
    minimize: true,
    minimizer: [
      new webpack.BannerPlugin(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}`),
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      new CssMinimizerPlugin(),
    ],
  },
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64]'
              },
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
        exclude: /(node_modules|theme|@dx\/xbee|@dx\/xpanda)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[hash:base64]'
              },
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
                relativeUrls: false
              }
            }
          }
        ]
      },
      {
        test: /(theme|xbee|xpanda)\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
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
                javascriptEnabled: true
              }
            }
          }
        ]
      },
    ])
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('../data/manifest.json')
    }),
    new webpack.DefinePlugin({
      API_SERVER_PLACEHOLDER: JSON.stringify('')
    }),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../data')
        }
      ]
    }),
    new webpack.optimize.MinChunkSizePlugin({
      // Minimum number of characters
      minChunkSize: 10000,
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[name].[hash].css',
      filename: '[name].css'
    }),
    new CaseSensitivePathsWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   template: 'template/index.prod.html',
    //   hash: true,
    //   random: Math.random().toString().slice(2)
    // })
  ]
}

function resolve(p) {
  return path.join(__dirname, '../src', p)
}
