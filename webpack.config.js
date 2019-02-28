let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin =require('copy-webpack-plugin');

let conf = {
  entry: './src/index.js',
  devServer: {
    overlay: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.pug')
    }),
    new ExtractTextPlugin('styles.css'),
    new CopyWebpackPlugin([
      {
        from: './src/fonts',
        to: './fonts'
      },
      {
        from: './src/**/*.jpg',
        to: './images',
        flatten: true
      },
      {
        from: './src/**/*.png',
        to: './images',
        flatten: true
      }
    ])
  ]

};

module.exports = (env, options) => {
  let production = options.mode === "production";

  conf.devtool = production ? false : "eval-sourcemap";

  let cssMap = !production;
  let publicDir = production ? "https://morganalf.github.io/resume/dist/" : "/";

  conf.output = {
    path: path.resolve(__dirname, './dist'),
        filename: "main.js",
        publicPath: publicDir
  };

  conf.module = {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: cssMap,
                url: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: cssMap ? 'inline' : false,
                plugins: function() {
                  if (production) {
                    return [
                      require('autoprefixer'),
                      require('cssnano')
                    ]
                  } else {
                    return [
                      require('autoprefixer')
                    ]
                  }
                }
              }
            },
            'stylus-loader'
          ]
        })
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
  };

  return conf;
};