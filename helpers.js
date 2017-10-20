var path = require('path');

function isWebpackDevServer() {
  return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function createTsConfigPathAliases(tsConfig) {
  var alias = {};
  var baseUrl = tsConfig.compilerOptions.baseUrl;
  var tsPaths = tsConfig.compilerOptions.paths;
  for (var prop in tsPaths) {
    let relativePath = tsPaths[prop][0];
    const wildcardEnding = '/*';

    // Trim wildcards (we don't need them for webpack aliases - it works as wildcard by default)
    if (prop.endsWith(wildcardEnding) && relativePath.endsWith(wildcardEnding)) {
      prop = prop.substring(0, prop.length - wildcardEnding.length);
      relativePath = relativePath.substring(0, relativePath.length - wildcardEnding.length);      
    }
    
    alias[prop] = root(baseUrl, relativePath);

    //console.log('ALIAS: ' + prop + '=' + alias[prop]);
  }

  return alias;
}

function isTestWatch() {
  return process.env.npm_lifecycle_script.indexOf('--auto-watch') !== -1;
}

function isTestCoverageEnabled() {
  // skip coverage in watch mode
  // See http://stackoverflow.com/questions/39131809/karma-webpack-sourcemaps-not-working
  return !isTestWatch(); 
}

exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.createTsConfigPathAliases = createTsConfigPathAliases;
exports.isTestWatch = isTestWatch;
exports.isTestCoverageEnabled = isTestCoverageEnabled;