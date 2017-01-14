import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { decorateModuleRef } from './app/environment.browser';
import { AppBrowserModuleNgFactory } from '../compiled/src/app/app.browser.module.ngfactory';

enableProdMode();

/*
 * Bootstrap our Angular app with a top level NgModule
 */
// tslint:disable-next-line:no-any
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
