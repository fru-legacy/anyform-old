/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const name = 'anyform';

const extractSass = new ExtractTextPlugin({
  filename: name + '.css',
  disable: env !== 'build'
});
const plugins = [extractSass];

const filename = name + (env === 'build' ? '.min.js' : '.js');
if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
}

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: filename,
    library: name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader'
          },{
            loader: 'sass-loader'
          }],
          fallback: 'style-loader'
        })
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  externals: {
    'react': 'react',
    'react-dnd': 'react-dnd',
    'immutable': 'immutable',
    'classnames': 'classnames'
  },
  plugins: plugins
};

module.exports = config;
