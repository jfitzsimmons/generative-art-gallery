const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Generative Art Gallery',
      pageHeader: 'Art',
      random: 'random',
      shuffle: 'shuffle',
      pin: 'PIN',
      another: 'another',
      again: 'again',
      sorry: 'Sorry, your browser does not support canvas.',
      favicon: './src/assets/favicons/favicon.ico',
      template: './src/index.html',
    })
  ],
  devServer: {
    allowedHosts: 'auto',
    client: {
      overlay: true,
    },
    open: true,
    port: 8000,
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};