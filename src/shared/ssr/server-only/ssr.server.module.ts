import { NgModule } from '@angular/core';
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
      ]
    };
  }
}


