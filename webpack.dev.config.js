const { merge } = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    host: 'localhost',
    // https: true,
    port: 5500,
    open: true,
    historyApiFallback: true,
  },
});
