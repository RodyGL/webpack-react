const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');
const getClientEnvironment = require('./env');

const env = getClientEnvironment();

const isEnvDevelopment = env.NODE_ENV === 'development';
const isEnvProduction = env.NODE_ENV === 'production';

if (!isEnvDevelopment && !isEnvProduction) {
  throw new Error("NODE_ENV must be 'development' or 'production'");
}

const paths = {
  appBuild: path.resolve(__dirname, 'build'),
  appPublic: path.resolve(__dirname, 'public'),
  appHtml: path.resolve(__dirname, 'public/index.html'),
  appSrc: path.resolve(__dirname, 'src'),
  appIndex: path.resolve(__dirname, 'src/index'),
  publicUrl: env.PUBLIC_URL ? env.PUBLIC_URL : '/',
};

module.exports = {
  mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
  devtool: isEnvProduction
    ? 'source-map'
    : isEnvDevelopment && 'eval-cheap-module-source-map',
  entry: [paths.appIndex],
  output: {
    path: paths.appBuild,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',
    globalObject: 'this',
    publicPath: paths.publicUrl,
  },
  devServer: {
    open: true,
    port: 3000,
    publicPath: paths.publicUrl,
    contentBase: paths.appPublic,
    contentBasePublicPath: paths.publicUrl,
    watchContentBase: true,
    compress: true,
    clientLogLevel: 'silent',
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrl,
    },
    hot: true,
    overlay: false,
    quiet: true,
  },
  optimization: {
    minimize: isEnvProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            safari10: true,
          },
          output: {
            ascii_only: true,
          },
        },
        sourceMap: true,
      }),
      new CssMinimizerPlugin({
        sourceMap: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: [
      '.web.mjs',
      '.mjs',
      '.web.js',
      '.js',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
    alias: {
      '@': paths.appSrc,
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        parser: {
          requireEnsure: false,
        },
      },
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
              babelrc: false,
              configFile: false,
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
                    runtime: 'automatic',
                    // Adds component stack to warning messages
                    // Adds __self attribute to JSX which React will use for some warnings
                    development: isEnvDevelopment,
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
                isEnvProduction && [
                  'transform-react-remove-prop-types',
                  {
                    removeImport: true,
                  },
                ],
                isEnvDevelopment && [
                  'transform-imports',
                  {
                    'lodash-es': {
                      transform: `lodash-es/\${member}`,
                      preventFullImport: true,
                    },
                  },
                ],
                isEnvDevelopment && 'react-refresh/babel',
                // Optional chaining and nullish coalescing are supported in @babel/preset-env,
                // but not yet supported in webpack due to support missing from acorn.
                // These can be removed once webpack has support.
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ].filter(Boolean),
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: true,
              inputSourceMap: true,
              compact: isEnvProduction,
            },
          },
          {
            test: /\.(sa|sc|c)ss$/,
            use: [
              isEnvDevelopment && 'style-loader',
              isEnvProduction && {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true,
                },
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: isEnvProduction,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: isEnvProduction,
                  postcssOptions: {
                    plugins: [
                      'autoprefixer', //
                    ],
                  },
                },
              },
            ].filter(Boolean),
            sideEffects: true,
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
  plugins: [
    isEnvProduction && new CleanWebpackPlugin(),
    isEnvProduction &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.appPublic,
            to: paths.appBuild,
          },
        ],
      }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
          templateParameters: env,
        },
        isEnvProduction
          ? {
              inject: true,
              template: paths.appHtml,
              templateParameters: env,
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
            }
          : undefined
      )
    ),
    new EnvironmentPlugin(Object.keys(env)),
    isEnvDevelopment && new HotModuleReplacementPlugin(),
    isEnvDevelopment && new ReactRefreshWebpackPlugin(),
    isEnvProduction &&
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
      async: isEnvDevelopment,
    }),
  ].filter(Boolean),
};
