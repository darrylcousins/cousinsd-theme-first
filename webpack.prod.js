const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

// try brottli?
// https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html
//  plugins: [
//      new BrotliPlugin({
//            asset: '[path].br[query]',
//                  test: /\.(js|css|html|svg)$/,
//                        threshold: 10240,
//                              minRatio: 0.8
//                                  })
//                                    ],

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  /*
  devtool: '', // Removed dev-tools mapping
  externals: [nodeExternals({
    modulesFromFile: {
      exclude: ['devDependencies'],
    }
  })],
  */
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    /*
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
    */
  }
})
