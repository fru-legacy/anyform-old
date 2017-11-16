/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const folder = require('yargs').argv.folder || 'example';
const isBuild = require('yargs').argv.env === 'build';
const isLibrary = folder !== 'example';

const css = new ExtractTextPlugin({
  filename: 'index.min.css',
  disable: isBuild
});

const config = {
  entry: __dirname + '/' + folder + '/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/' + folder + '/dist',
    filename: 'index.min.js',
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: css.extract({
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
    modules: [path.resolve('./'), 'node_modules'],
    extensions: ['.js']
  },
  plugins: [
    css,
    new UglifyJsPlugin({ minimize: isBuild })
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: {
      index: './example/index.html'
    }
  }
};

if (isLibrary) {
  config.output.library = folder + '.min.js';
  config.output.libraryTarget = 'umd';
  config.output.umdNamedDefine = true;
  config.externals = {
    'react': 'react',
    'react-dnd': 'react-dnd',
    'immutable': 'immutable',
    'classnames': 'classnames'
  };
} else {
  config.resolve.alias = { 
    'anyform-core': path.resolve('./anyform-core')
  }
}

module.exports = config;
