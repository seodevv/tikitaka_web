const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    //   publicPath: '/',
    //   assetModuleFilename: "asset/[hash][ext][query]",
  }, // 출력 경로을 지정
});
