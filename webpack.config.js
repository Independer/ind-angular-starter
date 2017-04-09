// Based on angular2-webpack-starter: https://github.com/AngularClass/angular2-webpack-starter/tree/1349411df7ced79f2e8486ce7f4aae6ab5e083e0

const webpack = require('webpack');
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
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeJsPlugin = require('optimize-js-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;

const env = helpers.hasNpmFlag('prod') ? 'Production' : (process.env.ASPNETCORE_ENVIRONMENT || 'Development');
const isDev = env === 'Production' ? false : true;  
const isAot = helpers.hasNpmFlag('aot');
const distPath = 'dist';
const tsConfigName = isDev ? 'tsconfig.json' : 'tsconfig.prod.json';
const analyzeMode = false; // Set this flag to true to analyze what is included in the bundle using the BundleAnalyzerPlugin.

const tsLintOptions = {
  // tslint errors are displayed by default as warnings 
  // set emitErrors to true to display them as errors 
  emitErrors: true,

  // tslint does not interrupt the compilation by default 
  // if you want any file with tslint errors to fail 
  // set failOnHint to true 
  failOnHint: false
};

function makeWebpackConfig() {  
  if (analyzeMode) {
    console.log('Running Webpack build in Analyze mode. A web browser window with statistics will be opened after the build completes sucessfully.');
  }  

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log(env.toUpperCase() + ' | ' + (isAot ? 'AOT' : 'JIT'));
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

  var config = {};

  config.target = 'web';

  if (isDev) {
    config.devtool = 'cheap-module-source-map'; 
  }

  // Cache generated modules and chunks to improve performance for multiple incremental builds.
  // This is enabled by default in watch mode.
  // You can pass false to disable it.
  //config.cache = false,

  config.entry = {};

  config.entry['polyfills'] = './src/polyfills.ts';
  config.entry['main'] = isAot ? './src/main.aot.ts' : './src/main.ts';

  config.output = {
    path: helpers.root('wwwroot', distPath)
  };

  config.output.filename = '[name].bundle.js';    
  config.output.chunkFilename = '[id].[chunkhash].chunk.js';
  config.output.publicPath = '/dist/';
  
  if (isDev) {
    config.output.library = 'ac_[name]';
    config.output.libraryTarget = 'var';
  }

  config.resolve = {

    // An array of extensions that should be used to resolve modules.
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('src'), helpers.root('node_modules')],

    alias: helpers.createTsConfigPathAliases(require('./' + tsConfigName))
  };

  config.module = {

    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: /(node_modules)/,
      },

      // Typescript loader support for .ts and Angular 2 async routes via .async.ts
      // Replace templateUrl and stylesUrl with require()
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ng-router-loader',
            options: {
              loader: 'async-import',
              genDir: 'aot_temp',
              aot: isAot,
              debug: false
            }
          },
          'awesome-typescript-loader?{configFileName: "' + tsConfigName + '"}',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      // to string and css loader support for *.css files (from Angular components)
      // Returns file content as string
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src', 'styles')]
      },

      // to string and sass loader support for *.scss files (from Angular components)
      // Returns compiled css content as string
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [helpers.root('src', 'styles')]
      },

      // to string and css loader support for *.css files (from Angular components)
      // Returns file content as string
      {
        test: /\.css$/,
        loader: isDev ? 'style-loader!css-loader' : ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        include: [helpers.root('src', 'styles')]
      },

      // To string and sass loader support for *.scss files (from Angular components)
      // Returns compiled css content as string
      {
        test: /\.scss$/,
        loader: isDev ? 'style-loader!css-loader!sass-loader' : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        }),
        include: [helpers.root('src', 'styles')]
      },

      // Raw loader support for *.html. Returns file content as string
      {
        test: /\.html$/,
        use: 'raw-loader'
      },

      // File loader for supporting images, for example, in CSS files.
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

    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new DefinePlugin({
      'ENV': JSON.stringify(env),
      'process.env': {
        'ENV': JSON.stringify(env),
        'NODE_ENV': JSON.stringify(env)
      }
    }),

    // Provides context to Angular's use of System.import. See: https://github.com/angular/angular/issues/11580
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      helpers.root('src'), // location of your src
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),

    new TsConfigPathsPlugin({
      tsconfig: tsConfigName
    }),

    // Experimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
    new LoaderOptionsPlugin({
      options: {
        tslint: tsLintOptions
      }
    }),

    // Fix Angular 2
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)async/,
      helpers.root('node_modules/@angular/core/src/facade/async.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)collection/,
      helpers.root('node_modules/@angular/core/src/facade/collection.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)errors/,
      helpers.root('node_modules/@angular/core/src/facade/errors.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)lang/,
      helpers.root('node_modules/@angular/core/src/facade/lang.js')
    ),
    new NormalModuleReplacementPlugin(
      /facade(\\|\/)math/,
      helpers.root('node_modules/@angular/core/src/facade/math.js')
    ),

    new ngcWebpack.NgcWebpackPlugin({
      disabled: !isAot,
      tsConfig: helpers.root(tsConfigName),
      resourceOverride: helpers.root('aot-empty-resource.js')
    })    
  ];  
  
  if (isDev) {
    var dllConfig = require('./webpack.dev.dll.js');

    config.plugins = config.plugins.concat([
      // Eperimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
      new LoaderOptionsPlugin({
        debug: true,
        options: {
          tslint: tsLintOptions
        }
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
      // Shares common code between the pages.It identifies common modules and put them into a commons chunk.
      // See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      // This enables tree shaking of the vendor modules
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),
      // Specify the correct order the scripts will be injected in
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),

      new OptimizeJsPlugin({
        sourceMap: false
      }),

      // Extracts imported CSS files into external stylesheet        
      new ExtractTextPlugin('[name].css'),

      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
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

      // Replace resources that matches resourceRegExp with newResource
      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('empty.js')
      ),

      new NormalModuleReplacementPlugin(
        /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
        helpers.root('empty.js')
      ),

      // Experimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
          tslint: tsLintOptions,
          // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },

        }
      })      
    ]);
  }

  if (isAot) {
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
      new BundleAnalyzerPlugin()
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
}

module.exports = makeWebpackConfig();
