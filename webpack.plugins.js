const webpack = require('webpack');
const basename = require('path').basename;
const AsyncDependenciesBlock = require('webpack/lib/AsyncDependenciesBlock');
const ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');
const ImportDependency = require('webpack/lib/dependencies/ImportDependency');

// Borrowed from Angular CLI: https://github.com/angular/angular-cli/blob/f8f42833ec2271270641a4af28174bd823d0370c/packages/%40angular/cli/plugins/named-lazy-chunks-webpack-plugin.ts
class NamedLazyChunksWebpackPlugin extends webpack.NamedChunksPlugin {
  constructor() {
    // Append a dot and number if the name already exists.

    let getUniqueName = (baseName) => {
      let name = baseName;
      let num = 0;
      while (this.nameMap.has(name)) {
        name = `${baseName}.${num++}`;
      }
      this.nameMap.set(name, true);
      return name;
    }

    let createChunkNameFromModuleFilePath = (filePath) => {
      let moduleName = basename(filePath).replace(/(\.ngfactory)?(\.(js|ts))?$/, '').replace(/\.module$/, '');

      if (!moduleName || moduleName === '') {
        // Bail out if something went wrong with the name.
        return null;
      }

      return moduleName;
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

    this.nameMap = new Map();
  }

  apply(compiler) {
    super.apply(compiler);

    compiler.plugin("done", (stats) => {
		  this.nameMap.clear();
		});
  }
}

module.exports = {
  NamedLazyChunksWebpackPlugin: NamedLazyChunksWebpackPlugin
};
