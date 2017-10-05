// Based on angular2-webpack-starter: https://github.com/AngularClass/angular2-webpack-starter/tree/1349411df7ced79f2e8486ce7f4aae6ab5e083e0

const webpack = require('webpack');
const os = require('os');
const helpers = require('./helpers');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ngcWebpack = require('ngc-webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeJsPlugin = require('optimize-js-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { NamedLazyChunksWebpackPlugin } = require('./webpack.plugins');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const stats = {
  assets: true,
  cached: false,
  cachedAssets: false,
  children: false,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  colors: true,
  depth: false,
  entrypoints: false,
  errors: true,
  errorDetails: true,
  hash: false,
  maxModules: 0,
  modules: false,
  performance: true,
  providedExports: false,
  publicPath: false,
  reasons: true,
  source: false,
  timings: true,
  usedExports: true,
  version: true,
  warnings: true
};

module.exports = function (args = {}) {
  const env = args.PROD ? 'Production' : (process.env.ASPNETCORE_ENVIRONMENT || 'Development');
  const isDev = env === 'Production' ? false : true;
  const isProd = !isDev;
  const isServer = !!args.SERVER;
  const isAot = !!args.AOT;
  const distPath =  isServer ? 'serverdist' : 'dist';
  const tsConfigName = isDev ? 'tsconfig.json' : 'tsconfig.prod.json';
  const tsConfigWithPathAliases = 'tsconfig.json';
  const analyzeMode = args.ANALYZE;
  const cpuCount = os.cpus().length;

  if (analyzeMode) {
    console.log('Running Webpack build in Analyze mode. A web browser window with statistics will be opened after the build completes sucessfully.');
  }

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ' + (isServer ? 'SERVER' : 'BROWSER') + ' | ' + env.toUpperCase() + ' | ' + (isAot ? 'AOT' : 'JIT') + ' @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('CPU Count: ' + cpuCount);

  var config = {};

  config.target = isServer ? 'node' : 'web';
  config.stats = stats;
  config.bail = !isDev;

  if (isDev) {
    if (isServer) {
      config.devtool = 'inline-source-map';
    }
    else {
      config.devtool = 'cheap-module-source-map';
    }
  }

  // Cache generated modules and chunks to improve performance for multiple incremental builds.
  // This is enabled by default in watch mode.
  // You can pass false to disable it.
  //config.cache = false,

  config.entry = {};

  if (isServer) {
    config.entry['main'] = isAot ? './src/main.server.aot.ts' : './src/main.server.ts';
  }
  else {
    config.entry['polyfills'] = './src/polyfills.browser.ts';
    config.entry['main'] = isAot ? './src/main.browser.aot.ts' : './src/main.browser.ts';
    config.entry['styles'] = './src/styles/app.scss';
  }

  config.output = {
    path: helpers.root('wwwroot', distPath)
  };

  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].[chunkhash].chunk.js';
  config.output.publicPath = '/dist/';

  if (isServer) {
    config.output.libraryTarget = 'commonjs';
  }
  else if (isDev) {
    config.output.library = 'ac_[name]';
    config.output.libraryTarget = 'var';
  }

  config.resolve = {
    extensions: ['.ts', '.js', '.json'],
    modules: [helpers.root('src'), helpers.root('node_modules')],
    alias: helpers.createTsConfigPathAliases(require('./' + tsConfigWithPathAliases))
  };

  config.module = {

    rules: [
      {
        test: /\.ts$/,
        use: 'happypack/loader?id=ts',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src', 'styles')]
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [helpers.root('src', 'styles')]
      },
      {
        test: /\.css$/,
        loader: isServer ? 'to-string-loader!css-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        include: [helpers.root('src', 'styles')]
      },
      {
        test: /\.scss$/,
        loader: isServer ? 'to-string-loader!css-loader!sass-loader' : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      },

    ],

  };

  config.plugins = [
    new CleanWebpackPlugin([helpers.root('wwwroot', distPath), helpers.root('aot_temp')], {
      verbose: false
    }),

    new ProgressPlugin(),

    new HappyPack({
      id: 'ts',
      threads: cpuCount - 1, // there should be 1 cpu for the fork-ts-checker-webpack-plugin
      loaders: [
        {
          path: 'ng-router-loader',
          query: {
            loader: 'async-import',
            genDir: 'aot_temp',
            aot: isAot,
            debug: false
          }
        },
        {
          path: 'ts-loader',
          query: {
            configFile: tsConfigName,
            happyPackMode: true
          }
        },
        {
          path: 'angular2-template-loader'
        }
      ],
    }),

    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      watch: ['./src']
    }),

    new DefinePlugin({
      'ENV': JSON.stringify(env),
      'process.env': {
        'ENV': JSON.stringify(env),
        'NODE_ENV': JSON.stringify(env)
      }
    }),

    // Provides context to Angular's use of System.import. See: https://github.com/angular/angular/issues/11580
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('src'), // location of your src
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),

    // Experimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
    new LoaderOptionsPlugin({
      minimize: !isDev,
      debug: isDev
    }),

    new ngcWebpack.NgcWebpackPlugin({
      disabled: !isAot,
      tsConfig: helpers.root(tsConfigName),
      resourceOverride: helpers.root('aot-empty-resource.js')
    }),

    new NamedLazyChunksWebpackPlugin(),

    new ExtractTextPlugin('[name].css')
  ];

  if (!isServer) {
    config.plugins = config.plugins.concat([
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),
      new CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      })
    ]);
  }

  if (isDev && !isServer) {
    var dllConfig = require('./webpack.dev.dll.js');

    config.plugins = config.plugins.concat([
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true
      }),

      new DllBundlesPlugin({
        bundles: dllConfig.bundles,
        dllDir: helpers.root('wwwroot', 'dll_dev'),
        webpackConfig: dllConfig.webpackConfig
      })
    ]);
  }

  if (!isDev) {
    config.plugins = config.plugins.concat([
      new OptimizeJsPlugin({
        sourceMap: false
      }),

      // Description: Minimize all JavaScript output of chunks.
      // Loaders are switched into minimizing mode.
      // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
      new UglifyJsPlugin({
        // beautify: true, //debug
        // mangle: false, //debug
        // dead_code: false, //debug
        // unused: false, //debug
        // deadCode: false, //debug
        // compress: {
        //   screw_ie8: true,
        //   keep_fnames: true,
        //   drop_debugger: false,
        //   dead_code: false,
        //   unused: false
        // }, // debug
        // comments: true, //debug

        parallel: {
          cache: true,
          workers: cpuCount
        },
        beautify: false, //prod
        output: {
          comments: false
        }, //prod
        mangle: {
          screw_ie8: true
        }, //prod
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false // we need this for lazy v8
        },
      }),

      new NormalModuleReplacementPlugin(
        /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
        helpers.root('empty.js')
      )
    ]);
  }

  if (!isDev && !isServer) {
    config.plugins = config.plugins.concat([
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]);
  }

  if (isAot && !isServer) {
    config.plugins = config.plugins.concat([
      new NormalModuleReplacementPlugin(
        /@angular(\\|\/)upgrade/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /@angular(\\|\/)compiler/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /@angular(\\|\/)platform-browser-dynamic/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /dom(\\|\/)debug(\\|\/)ng_probe/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /dom(\\|\/)debug(\\|\/)by/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /src(\\|\/)debug(\\|\/)debug_node/,
        helpers.root('empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /src(\\|\/)debug(\\|\/)debug_renderer/,
        helpers.root('empty.js')
      ),
    ]);
  }

  if (analyzeMode) {
    config.plugins = config.plugins.concat([
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      })
    ]);
  }

  config.node = {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  };

  config.performance = {
    hints: false
  };

  return config;
};
