const helpers = require('./helpers');

const isCoverageEnabled = helpers.isTestCoverageEnabled(); 

module.exports = function (config) {
  var testWebpackConfig = require('./webpack.test.js')({
    env: 'test'
  });

  var configuration = {

    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',

    /*
     * Frameworks to use
     *
     * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [],

    client: {
      captureConsole: false,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    /*
     * list of files / patterns to load in the browser
     *
     * we are building the test environment in ./spec-bundle.js
     */
    files: [{
      pattern: './spec-bundle.js',
      watched: false
    }],

    /*
     * preprocess matching files before serving them to the browser
     * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      './spec-bundle.js': isCoverageEnabled ? ['coverage', 'webpack', 'sourcemap'] : ['webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.js
    webpack: testWebpackConfig,

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i.e.
      noInfo: true,
      // and use stats to turn off verbose output
      stats: {
        // options i.e. 
        chunks: false
      }
    },

    /*
     * test results reporter to use
     *
     * possible values: 'dots', 'progress'
     * available reporters: https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['kjhtml', 'mocha'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    /*
     * start these browsers
     * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers: [
      'ChromeWithDebug'
    ],

    customLaunchers: {
      ChromeWithDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9223']
      }
    },

    /*
     * Continuous Integration mode
     * if true, Karma captures browsers, runs the tests and exits
     */
    singleRun: true
  };
  
  if (isCoverageEnabled) {
    configuration.reporters.push('coverage');
    configuration.reporters.push('remap-coverage');

    configuration.coverageReporter = {
      type: 'in-memory'
    };

    configuration.remapCoverageReporter = {
      'text-summary': null,
      json: './wwwroot/coverage/coverage.json',
      html: './wwwroot/coverage/html'
    };
  }

  config.set(configuration);
};