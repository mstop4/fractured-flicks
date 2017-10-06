module.exports = {
    entry: './src/index.js',
    output: {
      filename: './dist/bundle.js' 
    },

    node: {
      fs: "empty"
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
}