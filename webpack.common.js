const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
      filename: './dist/bundle.js' 
    },

    node: {
      fs: "empty"
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },

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