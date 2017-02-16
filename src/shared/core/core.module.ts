import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from '..//module-import-guard';
import { HttpCacheService, CacheService } from './cache';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  providers: [    
    HttpCacheService,
    CacheService
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
