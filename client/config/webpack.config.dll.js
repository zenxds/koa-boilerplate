const path = require('path')
const dayjs = require('dayjs')
const webpack = require('webpack')
const TerserPlugin = require("terser-webpack-plugin")

const dependencies = require('../package.json').dependencies
const rules = require('./webpack.rules')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    vendor: Object.keys(dependencies)
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
    library: '[name]'
  },
  module: {
    rules
  },
  optimization: {
    minimize: true,
    minimizer: [
      new webpack.BannerPlugin(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}`),
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../tmp', 'manifest.json'),
      name: '[name]'
    }),
  ]
}
