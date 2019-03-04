let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin =require('copy-webpack-plugin');

let conf = {
  entry: './src/index.js',
  devServer: {
    overlay: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }
};

module.exports = (env, options) => {
  let production = options.mode === "production";

  conf.devtool = production ? false : "eval-sourcemap";

  let cssMap = !production;
  let publicDir = production ? "https://morganalf.github.io/resume/dist/" : "/";
  let cleanDist = production ? new CleanWebpackPlugin() : new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: []});

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

  conf.plugins = [
    cleanDist,
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
        from: './src/components/**/*.jpg',
        to: './images',
        flatten: true
      },
      {
        from: './src/components/**/*.png',
        to: './images',
        flatten: true
      },
      {
        from: './src/favicons/**/*.*',
        to: './',
        flatten: true
      }
    ])
  ];

  return conf;
};