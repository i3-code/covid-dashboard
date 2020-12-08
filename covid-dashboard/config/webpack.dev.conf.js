const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 3000,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(process.env.APP_ENV),
      API_KEY: JSON.stringify(process.env.API_KEY),
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});
