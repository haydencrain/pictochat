const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const DotenvPlugin = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // injects any variables set in .env.dev into process.env.<varname>
    new DotenvPlugin({
      path: path.join(__dirname, '../.env.prod'),
      systemvars: true // any existing environment variables already set take precedence
    })
  ]
});
