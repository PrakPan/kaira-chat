const TerserPlugin = require('terser-webpack-plugin');

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
  mode: 'production',
  performance: {
    maxAssetSize: 500000,
    maxEntrypointSize: 500000,
  },
  output: {
    publicPath: 'https://mycdn.com/',
  },
};
