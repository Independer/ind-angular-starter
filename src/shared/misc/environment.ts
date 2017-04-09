import { enableProdMode } from '@angular/core';
import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
// Environment Providers
let PROVIDERS: any[] = [
  // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let decorateModuleRefFunc = <T>(value: T): T => value;

if ('Production' === ENV) {
  enableProdMode();

  // Production  
  decorateModuleRefFunc = (modRef: any) => {
    disableDebugTools();

    return modRef;
  };

  PROVIDERS = [
    ...PROVIDERS
    // custom providers in production
  ];

}
else {
  decorateModuleRefFunc = (modRef: any) => {
    const appRef = modRef.injector.get(ApplicationRef);
    const cmpRef = appRef.components[0];
    
    const w = (<any>window);

    let ng = w.ng;
    enableDebugTools(cmpRef);
    w.ng.probe = ng.probe;
    w.ng.coreTokens = ng.coreTokens;
    return modRef;
  };

  // Development
  PROVIDERS = [
    ...PROVIDERS
    // custom providers in development
  ];

}

export const decorateModuleRef = decorateModuleRefFunc;

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
