// Based on angular2-webpack-starter: https://github.com/AngularClass/angular2-webpack-starter/tree/1349411df7ced79f2e8486ce7f4aae6ab5e083e0

// see https://github.com/webpack/loader-utils/issues/56
process.noDeprecation = true;

const os = require('os');
const helpers = require('./helpers');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeJsPlugin = require('optimize-js-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const AngularNamedLazyChunksWebpackPlugin = require('angular-named-lazy-chunks-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { PurifyPlugin } = require('@angular-devkit/build-optimizer');

const apps = [
  {
    name: 'first',
    baseUrl: '/first',
    supportSsr: true
  },
  {
    name: 'second',
    baseUrl: '/second',
    supportSsr: true
  }
];

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
  const isServer = !!args.SERVER;
  const isAot = !!args.AOT;
  const enableDevDlls = !args.NO_DEV_DLL;
  const isNodeDevServer = helpers.isWebpackDevServer();
  const distPath =  isServer ? 'serverdist' : 'dist';
  const tsConfigName = isDev ? 'tsconfig.json' : 'tsconfig.prod.json';
  const tsConfigWithPathAliases = 'tsconfig.json';
  const analyzeMode = args.ANALYZE;
  const cpuCount = os.cpus().length;

  if (analyzeMode) {
    console.log('Running Webpack build in Analyze mode. A web browser window with statistics will be opened after the build completes sucessfully.');
  }

  if (isNodeDevServer) {
    console.log('Running Webpack build in the webpack-dev-server mode (the HTML will be generated on the fly and no files will be writen to disk).')
  }

  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ' + (isServer ? 'SERVER' : 'BROWSER') + ' | ' + env.toUpperCase() + ' | ' + (isAot ? 'AOT' : 'JIT') + ' @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('CPU Count: ' + cpuCount);

  var config = {};

  config.target = isServer ? 'node' : 'web';
  config.stats = stats;

  if (!isDev) {
    config.bail = true;
  }

  if (isDev) {
    if (isServer) {
      config.devtool = 'inline-source-map';
    }
    else {
      config.devtool = 'cheap-module-source-map';
    }
  }

  config.entry = {};

  if (isServer) {
    apps.forEach(function (app) {
      if (app.supportSsr) {
        config.entry[getAppBundleName(app)] = './src/apps/' + app.name + (isAot ? '/main.server.aot.ts' : '/main.server.ts');
      }
    });
  }
  else {
    config.entry['polyfills'] = './src/polyfills.browser.ts';
    config.entry['styles'] = './src/styles/app.scss';

    apps.forEach(function (app) {
      config.entry[getAppBundleName(app)] = './src/apps/' + app.name + (isAot ? '/main.browser.aot.ts' : '/main.browser.ts');
    });
  }

  config.output = {
    path: helpers.root('wwwroot', distPath)
  };

  config.output.filename = '[name].js';
  config.output.chunkFilename = '[name].[chunkhash].js';
  config.output.publicPath = '/dist/';

  if (isServer) {
    config.output.libraryTarget = 'commonjs';
  }
  else if (isDev) {
    config.output.library = 'ac_[name]';
    config.output.libraryTarget = 'var';
  }

  config.resolve = {

    // An array of extensions that should be used to resolve modules.
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    modules: [helpers.root('src'), helpers.root('node_modules')],

    alias: helpers.createTsConfigPathAliases(require('./' + tsConfigWithPathAliases))
  };

  config.module = {

    rules: (() => {
      let rules = [];

      if (!isDev) {
        rules.push({          
          test: /\.(ts|js)$/,
          use: 'happypack/loader?id=js'          
        });
      }
      else {
        rules.push({
          test: /\.ts$/,
          use: 'happypack/loader?id=ts',
          exclude: [/\.(spec|e2e)\.ts$/]
        });
      }

      rules = rules.concat([        
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src', 'styles')]
        },
        {
          test: /\.scss$/,
          use: [
            'to-string-loader',
            'css-loader',
            'sass-loader'
            // Uncomment the following loader to add resources that should be included in all component SASS styles
            // {
            //   loader: 'sass-resources-loader',
            //   options: {
            //     resources: [
            //       helpers.root('src/styles/base/variables/*.scss'),
            //       helpers.root('src/styles/base/mixins/*.scss')
            //     ]
            //   }
            // }
          ],
          exclude: [helpers.root('src', 'styles')]
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }),
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('dev_server_template.html')]
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

      ]);

      return rules;
    })()
  };

  config.plugins = [
    new CleanWebpackPlugin([helpers.root('wwwroot', distPath)], {
      verbose: false
    }),

    new ProgressPlugin(),    

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
      /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
      helpers.root('src'), // location of your src
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),

    // Experimental. See: https://gist.github.com/sokra/27b24881210b56bbaff7
    new LoaderOptionsPlugin({
      minimize: !isDev,
      debug: isDev,
      options: {
        context: helpers.root('.')
      }
    }),

    new AngularNamedLazyChunksWebpackPlugin({ multiAppMode: true }),

    new ExtractTextPlugin({
      filename: '[name].css',
      disable: isDev || isServer
    }),
  ];

  if (!isServer) {
    config.plugins = config.plugins.concat([
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: apps.map(getAppBundleName),
        minChunks: module => /node_modules|(lib(\\|\/)npm)/.test(module.resource)
      }),
      new CommonsChunkPlugin({
        name: 'shared',
        chunks: apps.map(getAppBundleName),
        deepChildren: true,
        minChunks: 2
      })
    ]);

    apps.forEach(app => {
      config.plugins.push(new CommonsChunkPlugin({
        // Name of the entry chunk for the app
        name: getAppBundleName(app),

        // Extract all common code from children and deep children
        children: true,
        deepChildren: true,

        // Move all the common code an <app_name>.common chunk that is going to
        // be asyncroniously loaded
        async: getAppBundleName(app) + '.common',

        // Move to common chank only if the code is used by 2 or more chunks.
        minChunks: 2
      }));
    });
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
      }),
    ]);
  }

  if (isDev) {
    config.plugins = config.plugins.concat([
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true
      }),

      new HappyPack({
        id: 'ts',
        threads: Math.min(cpuCount - 1 /* at least 1 cpu for the fork-ts-checker-webpack-plugin */, 8 /* More than 8 threads probably will not improve the build speed */),
        loaders: [
          {
            path: 'angular-router-loader',
            query: {
              debug: true
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
        ]
      }),    

      new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        watch: ['./src']
      })
    ]);

    if (!isNodeDevServer /* webpack-dev-server does automatic reload */) {
      config.plugins = config.plugins.concat([
        new LiveReloadPlugin()
      ]);
    }

    if (enableDevDlls && !isServer) {
      var dllConfig = require('./webpack.dev.dll.js');

      config.plugins = config.plugins.concat([
        new DllBundlesPlugin({
          bundles: dllConfig.bundles,
          dllDir: helpers.root('wwwroot', 'dll_dev'),
          webpackConfig: dllConfig.webpackConfig
        })
      ]);
    }

    if (isNodeDevServer) {
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
      const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

      config.plugins = config.plugins.concat([
        new AddAssetHtmlPlugin([{
          filepath: helpers.root('wwwroot', `dll_dev/${DllBundlesPlugin.resolveFile('polyfills')}`)
        },
        {
          filepath: helpers.root('wwwroot', `dll_dev/${DllBundlesPlugin.resolveFile('vendor')}`)
        }
        ]),

        new NamedModulesPlugin()
      ]);

      apps.forEach(function (app) {
        var otherApps = apps.slice();

        var appItemIndex = otherApps.indexOf(app);

        if (appItemIndex > -1) {
          otherApps.splice(appItemIndex, 1);
        }

        config.plugins.push(new HtmlWebpackPlugin({
          template: 'dev_server_template.html',
          title: app.name,
          filename: getAppDevServerHtmlFileName(app),
          excludeChunks: otherApps.map(getAppBundleName),
          chunksSortMode: 'manual',
          chunks: ['polyfills', 'vendor', 'shared', 'styles', getAppBundleName(app)],
          inject: 'head',
          metadata: {
            isDevServer: helpers.isWebpackDevServer(),
            baseUrl: app.baseUrl
          }
        }));
      });
    }
  }

  if (!isDev) {
    config.plugins = config.plugins.concat([
      new OptimizeJsPlugin({
        sourceMap: false
      }),

      new ModuleConcatenationPlugin(), 

      new HappyPack({
        id: 'js',
        threads: Math.min(cpuCount - 1 /* at least 1 cpu for the fork-ts-checker-webpack-plugin */, 8 /* More than 8 threads probably will not improve the build speed */),
        loaders: [
          {
            path: '@angular-devkit/build-optimizer/webpack-loader',
            query: {
              sourceMap: false
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
            path: 'angular-router-loader',
            query: {
              aot: true,
              debug: true
            }
          } 
        ]
      }),

      // This plugin must be before webpack.optimize.UglifyJsPlugin.
      new PurifyPlugin(),

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
          negate_iife: false, // we need this for lazy v8

          pure_getters: true,

          // PURE comments work best with 3 passes.
          // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
          // Using 1 pass for SSR because for some reason server-side rendering fails with "Cannot read property 'performance' of undefined" if `passes` is set to 3.
          passes: isServer ? 1 : 3
        },
      }),

      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('empty.js')
      ),

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

  if (isNodeDevServer) {
    config.devServer = {
      port: 5000,
      stats: stats,
      historyApiFallback: {
        rewrites: apps.map(function (app) {
          return {
            from: new RegExp('^' + app.baseUrl + '(\/.*|$)'),
            to: '/dist/' + getAppDevServerHtmlFileName(app)
          }
        })
      }
    };
  }

  return config;
}

function getAppBundleName(app) {
  return app.name;
}

function getAppDevServerHtmlFileName(app) {
  return app.name + '_index.html';
}
