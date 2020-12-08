const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [{
      test: /\.(css|scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: './postcss.config.js' } },
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ],
    }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${baseWebpackConfig.externals.paths.assets}/[name].[hash].css`,
    }),
  ],
});
