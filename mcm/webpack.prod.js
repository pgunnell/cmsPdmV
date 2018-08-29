var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = [{
    devtool: 'source-map',
    entry: {
      settings:  ['./vue_components/settings.js'],
      news:  ['./vue_components/news.js'] // example for multiple js files for each page
    },
    output: {
        // for prod output we set local path not abs path
        path: path.resolve(__dirname, 'scripts/build'),
        filename: '[name].vue.js'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new UglifyJsPlugin({
            "uglifyOptions":
                {
                    compress: {
                        warnings: false
                    },
                    sourceMap: true
                }
        }),
        new webpack.DefinePlugin({
            'API_URL': "'https://cms-pdmv-dev.cern.ch/mcm/'"})
  ]
}];