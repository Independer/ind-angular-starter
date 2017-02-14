import { NgModule } from '@angular/core';
// for AoT we need to manually split universal packages (/browser & /node)
import { UniversalModule } from 'angular2-universal/browser';

import { AppCommonModule } from './app.common.module';
import { AppComponent } from './app.component';
import { ENV_PROVIDERS } from 'shared';
import { CacheService } from 'shared';

export const UNIVERSAL_KEY = 'UNIVERSAL_CACHE';

export function getRequest() {
  return {};
}
export function getResponse() {
  return {};
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // "UniversalModule" Must be first import.
    // ** NOTE ** : This automatically imports BrowserModule, HttpModule, and 
    // JsonpModule for Browser,
    // and NodeModule, NodeHttpModule etc for the server.
    UniversalModule,

    AppCommonModule
  ],
  providers: [
    ENV_PROVIDERS
  ]
})
export class AppBrowserModule {
  constructor(private _cache: CacheService) {
    this.doRehydrate();
  }

  // Universal Cache "hook"
  doRehydrate() {
    let defaultValue = {};
    let serverCache = this._getCacheValue(CacheService.KEY, defaultValue);
    this._cache.rehydrate(serverCache);
  }

  // Universal Cache "hook
  _getCacheValue(key: string, defaultValue: any): any {
    // Get cache that came from the server
    const win: any = window;
    if (win[UNIVERSAL_KEY] && win[UNIVERSAL_KEY][key]) {
      let serverCache = defaultValue;
      try {
        serverCache = JSON.parse(win[UNIVERSAL_KEY][key]);
        if (typeof serverCache !== typeof defaultValue) {
          console.log('Angular Universal: The type of data from the server is different from the default value type');
          serverCache = defaultValue;
        }
      } 
      catch (e) {
        console.log('Angular Universal: There was a problem parsing the server data during rehydrate');
        serverCache = defaultValue;
      }
      return serverCache;
    } 
    else {
      console.log('Angular Universal: UNIVERSAL_CACHE is missing');
    }
    return defaultValue;
  }
}
