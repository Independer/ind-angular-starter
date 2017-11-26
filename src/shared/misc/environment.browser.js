"use strict";
exports.__esModule = true;
// Angular 2
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
// Environment Providers
var PROVIDERS = [];
// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
var decorateModuleRefFunc = function (value) { return value; };
if ('Production' === ENV) {
    core_1.enableProdMode();
    // Production
    decorateModuleRefFunc = function (modRef) {
        platform_browser_1.disableDebugTools();
        return modRef;
    };
    PROVIDERS = PROVIDERS.slice();
}
else {
    decorateModuleRefFunc = function (modRef) {
        var appRef = modRef.injector.get(core_1.ApplicationRef);
        var cmpRef = appRef.components[0];
        var w = window;
        var ng = w.ng;
        platform_browser_1.enableDebugTools(cmpRef);
        w.ng.probe = ng.probe;
        w.ng.coreTokens = ng.coreTokens;
        return modRef;
    };
    // Development
    PROVIDERS = PROVIDERS.slice();
}
exports.decorateModuleRef = decorateModuleRefFunc;
exports.ENV_PROVIDERS = PROVIDERS.slice();
