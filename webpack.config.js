let path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin =require('copy-webpack-plugin');
const DelWebpackPlugin = require('del-webpack-plugin');

module.exports = (env, options) => {
  let production = options.mode === 'production';
  let cssMap = !production;
  let publicDir = production ? 'https://morganalf.github.io/resume/' : '/';

  return {
    entry: './src/index.js',
    devServer: {
      overlay: true,
      watchOptions: {
        ignored: /node_modules/
      }
    },
    devtool: production ? false : 'eval-sourcemap',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
      publicPath: publicDir
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
                        require('cssnano'),
                        require('postcss-pxtorem')({
                          rootValue: 16,
                          unitPrecision: 5,
                          propList: ['*', '!max-width', '!min-width'],
                          selectorBlackList: ['html'],
                          replace: true,
                          mediaQuery: false,
                          minPixelValue: 0
                        })
                      ]
                    } else {
                      return [
                        require('autoprefixer'),
                        require('postcss-pxtorem')({
                          rootValue: 16,
                          unitPrecision: 5,
                          propList: ['*', '!max-width', '!min-width'],
                          selectorBlackList: ['html'],
                          replace: true,
                          mediaQuery: false,
                          minPixelValue: 0
                        })
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
    },
    plugins: [
      new DelWebpackPlugin({
        include: ['dist/**/*'],
        info: false,
        keepGeneratedAssets: true,
        allowExternal: false
      }),
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
    ]
  };
};