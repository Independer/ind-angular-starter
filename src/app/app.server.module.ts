
import { NgModule } from '@angular/core';
// for AoT we need to manually split universal packages (/browser & /node)
import { UniversalModule } from 'angular2-universal/node';

import { AppCommonModule } from './app.common.module';
import { AppComponent } from './app.component';
import { CacheService } from 'shared';

export function getRequest() {
  return Zone.current.get('req') || {};
}
export function getResponse() {
  return Zone.current.get('res') || {};
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // "UniversalModule" Must be first import.
    // ** NOTE ** : This automatically imports BrowserModule, HttpModule, and JsonpModule for Browser,
    // and NodeModule, NodeHttpModule etc for the server.
    UniversalModule,

    AppCommonModule
  ],
  providers: [
  ]
})
export class AppServerModule {
  constructor(private _cache: CacheService) { }

  /** Universal Cache "hook"
   * We need to use the arrow function here to bind the context as this is a gotcha
   * in Universal for now until it's fixed
   */  
  universalDoDehydrate = (universalCache: any) => {
    console.log('universalDoDehydrate ****');
    universalCache[CacheService.KEY] = JSON.stringify(this._cache.dehydrate());
  }

  /** Universal Cache "hook"
   * Clear the cache after it's rendered
   */
  universalAfterDehydrate = () => {
    this._cache.clear();
  }
}
