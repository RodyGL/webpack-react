const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const paths = {
  appBuild: path.resolve(__dirname, 'build'),
  appPublic: path.resolve(__dirname, 'public'),
  appHtml: path.resolve(__dirname, 'public/index.html'),
  appSrc: path.resolve(__dirname, 'src'),
};

const common = {
  entry: {
    app: './src/index',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: paths.appPublic,
          to: paths.appBuild,
        },
      ],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: paths.appBuild,
  },
  resolve: {
    extensions: [
      '.ts', //
      '.tsx',
      '.js',
      '.json',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        include: paths.appSrc,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: [
          '@svgr/webpack', //
          'url-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};

module.exports = {
  paths,
  common,
};
