const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    //controls: "./src/controls.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "Generative Art Gallery",
      pageHeader: "Art",
      random: "random",
      shuffle: "shuffle",
      pin: "PIN",
      another: "another",
      again: "again",
      sorry: "Sorry, your browser does not support canvas.",
      favicon: "./src/assets/favicons/favicon.ico",
      template: "./src/index.html",
    }),
  ],
  devtool: "source-map",
  devServer: {
    allowedHosts: "auto",
    hot: true,
    client: {
      overlay: true,
    },
    open: true,
    port: 8000,
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
