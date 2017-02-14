import { platformBrowser } from '@angular/platform-browser';
import { decorateModuleRef } from './shared/environment.browser';
import { AppBrowserModuleNgFactory } from '../aot_temp/src/app/app.browser.module.ngfactory';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppBrowserModuleNgFactory)    
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}

export function bootstrapDomReady() {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();
