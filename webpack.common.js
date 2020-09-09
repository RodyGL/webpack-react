const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const paths = {
  appBuild: path.resolve(__dirname, 'build'),
  appPublic: path.resolve(__dirname, 'public'),
  appHtml: path.resolve(__dirname, 'public/index.html'),
  appSrc: path.resolve(__dirname, 'src'),
  appIndex: path.resolve(__dirname, 'src/index'),
  appEnv: path.resolve(__dirname, '.env'),
  appEnvDev: path.resolve(__dirname, '.env.development'),
};

const common = {
  entry: [
    paths.appIndex, //
  ],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    globalObject: 'this',
  },
  resolve: {
    extensions: [
      '.ts', //
      '.tsx',
      '.js',
      '.jsx',
      '.json',
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        parser: {
          requireEnsure: false,
        },
      },
    ],
  },
  optimization: {
    minimizer: [
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
};

module.exports = {
  paths,
  common,
};
