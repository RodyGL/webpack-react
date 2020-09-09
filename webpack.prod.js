const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { common, paths } = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      path: paths.appEnv,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: paths.appPublic,
          to: paths.appBuild,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
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
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true,
                },
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
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
