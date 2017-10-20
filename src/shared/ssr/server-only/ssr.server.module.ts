import { NgModule } from '@angular/core';
import { SsrStateInjector } from './ssr-state-injector';
import { SsrState } from '../ssr-state';
import { PlatformService } from '../platform.service';

@NgModule({
  providers: [
    PlatformService
  ]
})
export class SsrServerModule {
  static forRoot() {
    return {
      ngModule: SsrServerModule,
      providers: [
        SsrState,
        SsrStateInjector
      ]
    };
  }
}


