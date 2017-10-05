const helpers = require('./helpers');
const path = require('path');

const webpack = require('webpack');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

const isCovarageEnabled = helpers.isTestCovarageEnabled();

module.exports = function (options) {
  return {

    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: helpers.createTsConfigPathAliases(require('./tsconfig.json'))
    },
    module: {
      rules: (() => {
        let rules = [
          {
            enforce: 'pre',
            test: /\.js$/,
            use: 'source-map-loader',
            exclude: [
              // these packages have problems with their sourcemaps
              helpers.root('node_modules/rxjs'),
              helpers.root('node_modules/@angular')
            ]
          },
          {
            test: /\.ts$/,
            loaders: [
              { loader: 'ts-loader', options: { transpileOnly: true } },
              'angular2-template-loader'
            ],
            exclude: [/\.e2e\.ts$/]
          },
          {
            test: /\.json$/,
            use: 'json-loader',
            exclude: [helpers.root('src/index.html')]
          },
          {
            test: /\.css$/,
            use: ['to-string-loader', 'css-loader'],
            exclude: [helpers.root('src/index.html')]
          },
          {
            test: /\.scss$/,
            use: [
              'to-string-loader',
              'css-loader',
              'sass-loader'
            ],
            exclude: [helpers.root('src/index.html')]
          },
          {
            test: /\.html$/,
            use: 'raw-loader',
            exclude: [helpers.root('src/index.html')]
          },

          /**
           * Instruments JS files with Istanbul for subsequent code coverage reporting.
           * Instrument only testing sources.
           *
           * See: https://github.com/deepsweet/istanbul-instrumenter-loader
           */

        ];

        if (isCovarageEnabled) {
          rules.push({
            enforce: 'post',
            test: /\.(js|ts)$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: {
                esModules: true
              }
            },
            include: helpers.root('src'),
            exclude: [
              /\.(e2e|spec)\.ts$/,
              /node_modules/
            ]
          });
        }

        return rules;
      })()
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        checkSyntacticErrors: true,
        watch: ['./src']
      }),

      new DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'process.env': {
          'ENV': JSON.stringify(ENV),
          'NODE_ENV': JSON.stringify(ENV)
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
      new LoaderOptionsPlugin({
        debug: false,
        options: {
          // legacy options go here

          context: helpers.root('.')
        }
      }),

      new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(ts|js)($|\?)/i // process .js and .ts files only
      })
    ],
    performance: {
      hints: false
    },
    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
