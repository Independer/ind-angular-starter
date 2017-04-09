const webpack = require('webpack');
const helpers = require('./helpers');

var bundles = {
  polyfills: [{
      name: 'core-js',
      path: 'core-js/es6/symbol.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/object.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/function.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/parse-int.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/parse-float.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/number.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/math.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/string.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/date.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/array.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/regexp.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/map.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/set.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/weak-map.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/weak-set.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/typed.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es6/reflect.js'
    },
    {
      name: 'core-js',
      path: 'core-js/es7/reflect.js'
    },
    {
      name: 'zone.js',
      path: 'zone.js/dist/zone.js'
    },
    {
      name: 'zone.js',
      path: 'zone.js/dist/long-stack-trace-zone.js'
    },
  ],
  vendor: [
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/core',
    '@angular/common',
    '@angular/forms',
    '@angular/http',
    '@angular/router',
    'rxjs',
    {
      name: 'style-loader',
      path: 'style-loader/addStyles.js'
    },
    'css-loader',
    'tslib'
  ]
};

var webpackConfig = (function () {
  var config = {};

  config.devtool = 'cheap-module-source-map';
  config.resolve = {
    extensions: ['.js', '.json'],
    modules: ['node_modules', helpers.root('src')]
  };

  config.module = {
    rules: [{
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader']
      }
    ]
  };

  config.plugins = [];

  config.node = {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  };

  return config;
})();

module.exports = {
  webpackConfig: webpackConfig,
  bundles: bundles
};