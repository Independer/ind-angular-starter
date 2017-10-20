const webpack = require('webpack');
const basename = require('path').basename;
const AsyncDependenciesBlock = require('webpack/lib/AsyncDependenciesBlock');
const ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');
const ImportDependency = require('webpack/lib/dependencies/ImportDependency');

const APP_NAME_REGEX = 'apps\\\\(.*?)\\\\';

// Borrowed from Angular CLI: https://github.com/angular/angular-cli/blob/f8f42833ec2271270641a4af28174bd823d0370c/packages/%40angular/cli/plugins/named-lazy-chunks-webpack-plugin.ts
// Customized to include the name of the app and remove ".module".
class NamedLazyChunksWebpackPlugin extends webpack.NamedChunksPlugin {
  constructor() {
    // Append a dot and number if the name already exists.
    const nameMap = new Map();

    function getUniqueName(baseName) {
      let name = baseName;
      let num = 0;
      while (nameMap.has(name)) {
        name = `${baseName}.${num++}`;
      }
      nameMap.set(name, true);
      return name;
    }

    function createChunkNameFromModuleFilePath(filePath) {
      let appName = '';
      let appNameMatch = new RegExp(APP_NAME_REGEX).exec(filePath);

      if (appNameMatch && appNameMatch.length > 0) {
        appName = appNameMatch[1];
      }

      let moduleName = basename(filePath).replace(/(\.ngfactory)?(\.(js|ts))?$/, '').replace(/\.module$/, '');

      if (appName) {
        // Get rid of the app name prefix in the module file name (we will add the prefix separately).
        moduleName = moduleName.replace(`${appName}-`, '');
      }

      if (!moduleName || moduleName === '') {
        // Bail out if something went wrong with the name.
        return null;
      }

      let result = (appName ? `${appName}.` : '') + moduleName;

      return result;
    }

    const nameResolver = (chunk) => {
      // Entry chunks have a name already, use it.
      if (chunk.name) {
        return chunk.name;
      }

      // Try to figure out if it's a lazy loaded route or import().
      if (chunk.blocks
        && chunk.blocks.length > 0
        && chunk.blocks[0] instanceof AsyncDependenciesBlock
        && chunk.blocks[0].dependencies.length === 1
        && (chunk.blocks[0].dependencies[0] instanceof ContextElementDependency
          || chunk.blocks[0].dependencies[0] instanceof ImportDependency)
      ) {
        const req = chunk.blocks[0].dependencies[0].request;

        let baseName = createChunkNameFromModuleFilePath(req);

        return getUniqueName(baseName);
      }

      return null;
    };

    super(nameResolver);
  }
}

module.exports = {
  NamedLazyChunksWebpackPlugin: NamedLazyChunksWebpackPlugin
};
