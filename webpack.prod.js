const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const css = new ExtractTextPlugin({
  filename: 'app.css'
})

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    css
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: css.extract({
          fallback: 'style-loader'
        })
      }
    ]
  },
})