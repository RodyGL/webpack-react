const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
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
    overlay: false,
    quiet: true,
  },
  plugins: [
    new Dotenv({
      path: paths.appEnvDev,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
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
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // Allow importing core-js in entrypoint and use browserlist to select polyfills
                    useBuiltIns: 'entry',
                    corejs: 3,
                    exclude: ['transform-typeof-symbol'],
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    // Adds component stack to warning messages
                    // Adds __self attribute to JSX which React will use for some warnings
                    development: true,
                    // Will use the native built-in instead of trying to polyfill
                    // behavior for any plugins that require one.
                    useBuiltIns: true,
                  },
                ],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                [
                  '@babel/plugin-transform-runtime',
                  {
                    useESModules: true,
                  },
                ],
                'react-refresh/babel',
              ],
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      'autoprefixer', //
                    ],
                  },
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
