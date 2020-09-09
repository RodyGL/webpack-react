const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { common, paths } = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    port: 3000,
    contentBase: paths.appPublic,
    compress: true,
    clientLogLevel: 'silent',
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
  },
  plugins: [
    new Dotenv({
      path: paths.appEnvDev,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
      async: true,
    }),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(bmp|png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
              },
            ],
          },
          {
            test: /\.(ts|js)x?$/,
            include: paths.appSrc,
            loader: 'babel-loader',
          },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              'style-loader', //
              'css-loader',
            ],
          },
          {
            loader: 'file-loader',
            exclude: [
              /\.(js|mjs|jsx|ts|tsx)$/, //
              /\.html$/,
              /\.json$/,
            ],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
});
