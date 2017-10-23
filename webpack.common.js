const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
      filename: './dist/bundle.js',
    },

    node: {
      fs: "empty"
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './dist/index.html',
        inject: 'body'
      })
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: path.resolve(__dirname, "src"),
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
}