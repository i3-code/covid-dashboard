const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets',
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    app: PATHS.src,
  },
  output: {
    filename: './js/[name].[hash].js',
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.(woff|woff2|ttf|otf|eot)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/fonts',
        name: '[name].[ext]',
        publicPath: '../assets/fonts',
      },
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/images',
        name: '[name].[ext]',
        publicPath: '../assets/images',
      },
    }, {
      test: /\.(wav|mp3|midi)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/sounds',
        name: '[name].[ext]',
        publicPath: '../assets/sounds',
      },
    }, {
      test: /\.(css|scss)$/,
      use: [
        'style-loader',
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
    new HtmlWebpackPlugin({
      inject: true,
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      favicon: `${PATHS.src}/${PATHS.assets}/icons/favicon.ico`,
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/static`,
        to: 'static',
        noErrorOnMissing: true,
      },
    ]),
  ],
};
