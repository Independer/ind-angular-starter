// Based on angular2-webpack-starter: https://github.com/AngularClass/angular2-webpack-starter/tree/1349411df7ced79f2e8486ce7f4aae6ab5e083e0

const webpack = require('webpack');
const helpers = require('./helpers');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const V8LazyParseWebpackPlugin = require('v8-lazy-parse-webpack-plugin');
const ngcWebpack = require('ngc-webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackMd5Hash = require('webpack-md5-hash');

const aspNetEnv = process.env.ASPNETCORE_ENVIRONMENT || 'Development';
const isServer = helpers.hasNpmFlag('server') || helpers.hasProcessFlag('SERVER_BUILD');
const isDev = aspNetEnv === 'Production' ? false : true;  
const isAot = helpers.hasNpmFlag('aot') || helpers.hasProcessFlag('AOT');
const distPath = isServer ? 'serverdist' : 'dist';
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
  console.log((isServer ? 'SERVER' : 'BROWSER') + ' | ' + aspNetEnv.toUpperCase() + ' | ' + (isAot ? 'AOT' : 'JIT'));
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

  var config = {};

  config.target = isServer ? 'node' : 'web';

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
    config.entry['main-server'] = './src/main.server.ts';
  }
  else {
    config.entry['polyfills'] = './src/polyfills.browser.ts';
    config.entry['main'] = isAot ? './src/main.browser.aot.ts' : './src/main.browser.ts';
  }

  config.output = {
    path: helpers.root('wwwroot', distPath)
  };

  if (isServer) {
    config.output.filename = '[name].js';
    config.output.libraryTarget = 'commonjs';
  }
  else {
    config.output.filename = '[name].bundle.js';    
    config.output.chunkFilename = '[id]' + (isDev || isServer ? '' : '.[chunkhash]') + '.chunk.js';
    config.output.publicPath = '/dist/';
    
    if (isDev) {
      config.output.library = 'ac_[name]';
      config.output.libraryTarget = 'var';
    }
  }  

  config.resolve = {

    // An array of extensions that should be used to resolve modules.
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('src'), helpers.root('node_modules')],

    alias: createTsConfigPathAliases(require('./' + tsConfigName))
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
              aot: isAot
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
        loader: isServer ? ('to-string-loader!css-loader') : (isDev ? 'style-loader!css-loader' : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })),
        include: [helpers.root('src', 'styles')]
      },

      // To string and sass loader support for *.scss files (from Angular components)
      // Returns compiled css content as string
      {
        test: /\.scss$/,
        loader: isServer ? ('to-string-loader!css-loader!sass-loader') : (isDev ? 'style-loader!css-loader!sass-loader' : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!sass-loader'
        })),
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
      'ENV': JSON.stringify(aspNetEnv),
      'process.env': {
        'ENV': JSON.stringify(aspNetEnv),
        'NODE_ENV': JSON.stringify(aspNetEnv)
      }
    }),

    // Do type checking in a separate process, so webpack don't need to wait.
    new CheckerPlugin(),    

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

  if (analyzeMode) {
    config.plugins = config.plugins.concat([
      new BundleAnalyzerPlugin()
    ]);
  }

  if (!isServer) {
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
        minChunks: module => /node_modules\//.test(module.resource)
      }),
      // Specify the correct order the scripts will be injected in
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
    ]);
  } 
  else {
    config.plugins = config.plugins.concat([
      // Workaround for the  "Module not found: Error: Can't resolve 'vertx' in '<path>\node_modules\es6-promise\dist'" warning
      // on server build. This appears to be not an issue and can be ignored (https://github.com/webpack/webpack/issues/353).
      new IgnorePlugin(/vertx/)
    ]);      
  }
  
  if (isDev) {
    config.plugins = config.plugins.concat([
      // Eperimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
      new LoaderOptionsPlugin({
        debug: true,
        options: {
          tslint: tsLintOptions
        }
      })
    ]);
  } else {
    if (!isServer) {
      config.plugins = config.plugins.concat([
        new WebpackMd5Hash(),

        // Extracts imported CSS files into external stylesheet        
        new ExtractTextPlugin('[name].css'),

        new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$/,
          threshold: 10240,
          minRatio: 0.8
        })
      ]);
    }    

    config.plugins = config.plugins.concat([
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

function createTsConfigPathAliases(tsConfig) {
    var alias = {};
    var tsPaths = tsConfig.compilerOptions.paths;
    for (var prop in tsPaths) {
        alias[prop] = helpers.root(tsPaths[prop][0]);

        console.log('ALIAS: ' + prop + '=' + alias[prop]);
    }    

    return alias;
}

module.exports = makeWebpackConfig();
