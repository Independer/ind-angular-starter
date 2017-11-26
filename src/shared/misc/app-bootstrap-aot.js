"use strict";
exports.__esModule = true;
var platform_browser_1 = require("@angular/platform-browser");
var environment_browser_1 = require("./environment.browser");
function bootstrapAot(moduleFactory) {
    function bootApplication() {
        return platform_browser_1.platformBrowser()
            .bootstrapModuleFactory(moduleFactory)
            .then(environment_browser_1.decorateModuleRef)["catch"](function (err) { return console.error(err); });
    }
    if (document.readyState === 'complete') {
        bootApplication();
    }
    else {
        document.addEventListener('DOMContentLoaded', bootApplication);
    }
}
exports.bootstrapAot = bootstrapAot;
