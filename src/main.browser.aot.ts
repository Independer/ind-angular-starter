/*
 * Angular bootstraping
 */
import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppBrowserModuleNgFactory } from '../compiled/src/app/app.browser.module.ngfactory';

enableProdMode();

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppBrowserModuleNgFactory)    
    .catch((err) => console.error(err));
}

export function bootstrapDomReady() {
  document.addEventListener('DOMContentLoaded', main);
}

bootstrapDomReady();
