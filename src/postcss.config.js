const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
            ExtractTextPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    require('autoprefixer'),
    //require('cssnano')
  ]
};