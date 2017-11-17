/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = require('yargs').argv.env || {};
const folder = env.folder || 'docs';
const isBuild = env.env === 'build';
const isLibrary = folder !== 'docs';

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
    publicPath: 'anyform/docs/dist'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
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
      },
      {
        test: /\.yaml$/,
        loaders: ['json-loader', 'yaml-loader'],
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./anyform-core/node_modules'),
      path.resolve('./anyform-default/node_modules'),
      path.resolve('./anyform-tree/node_modules'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    css
  ],
  devServer: {
    port: 3001,
    hot: true,
    historyApiFallback: {
      index: './docs/index.html'
    }
  }
};

if (isBuild) {
  config.plugins.push(new UglifyJsPlugin({ minimize: true }));
}

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
    'anyform-core': path.resolve('./anyform-core'),
    'anyform-default': path.resolve('./anyform-default')
  }
}

module.exports = config;
