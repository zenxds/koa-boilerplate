module.exports = [
  {
    test: /\.html$/i,
    loader: "raw-loader",
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    type: 'asset',
    generator: {
      filename: 'assets/fonts/[hash][ext]',
    },
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    type: 'asset',
    generator: {
      filename: 'assets/images/[hash][ext]',
    },
  }
]
