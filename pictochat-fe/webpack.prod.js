const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const DotenvPlugin = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CompressionPlugin({
      filename: `[path].gz[query]`,
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),
    new BrotliPlugin({
      filename: `[path].br[query]`,
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false
    }),
    // injects any variables set in .env.dev into process.env.<varname>
    new DotenvPlugin({
      path: path.join(__dirname, '../.env.prod'),
      systemvars: true // any existing environment variables already set take precedence
    })
  ]
});
