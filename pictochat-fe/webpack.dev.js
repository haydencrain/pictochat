const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  // devtool: false // use this if you want 30% faster builds but no sourcemap
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    index: 'index.html',
    open: true,
    port: 3000
  }
});
