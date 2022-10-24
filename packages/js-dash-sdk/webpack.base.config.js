const path = require('path');
const webpack = require('webpack');
const SnapsWebpackPlugin = require('@metamask/snaps-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const baseConfig = {
  entry: './src/index.ts',
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        keep_classnames: true // fixes empty string in `object.constructor.name`
      }
    })],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    fallback: {
      fs: false,
      util: require.resolve('util/'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      zlib: require.resolve('browserify-zlib'),
      events: require.resolve('events/'),
      string_decoder: require.resolve('string_decoder/'),
      tls: require.resolve('tls/'),
      net: require.resolve('net/'),
      // Browser build have to use native WebSocket
      ws: require.resolve('./build-utils/ws'),
    },
  },
  plugins: [
    new SnapsWebpackPlugin({
      /**
       * Whether to strip all comments from the bundle.
       */
      stripComments: true,
    
      /**
       * Whether to evaluate the bundle with SES, to ensure SES compatibility.
       */
      eval: true,
    
      /**
       * The path to the Snap manifest file. If set, it will be checked and automatically updated with
       * the bundle's hash, if `writeManifest` is enabled. Defaults to `snap/manifest.json` in the
       * current working directory.
       */
      manifestPath: './snap.manifest.json',
    
      /**
       * Whether to write the updated Snap manifest file to disk. If `manifestPath` is not set, this
       * option has no effect. If this is disabled, an error will be thrown if the manifest file is
       * invalid.
       */
      writeManifest: true,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: require.resolve('process/browser'),
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
}
module.exports = baseConfig;
