let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

let conf = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "main.js",
    publicPath: "/"
  },
  devServer: {
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.styl$/,
        use: [
          ExtractTextPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.(ttf|woff|svg)$/,
        use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            }
          ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.pug')
    }),
    new ExtractTextPlugin('styles.css')
  ]

};

module.exports = (env, options) => {
  let production = options.mode === "production";

  conf.devtool = production ? false : "eval-sourcemap";

  return conf;
};