import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { throwIfAlreadyLoaded } from 'shared';
import { HttpCacheService, CacheService } from 'shared';

@NgModule({
  imports: [    
  ],
  declarations: [
  ],
  providers: [
  ],
  exports: [
  ]
})
export class CacheModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        HttpCacheService,
        CacheService
      ]
    };
  }
}
