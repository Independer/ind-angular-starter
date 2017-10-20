import { NgModule } from '@angular/core';

import { AboutService } from './about.service';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: []
})
export class AboutModule {
  static forRoot() {
    return {
      ngModule: AboutModule,
      providers: [
        AboutService
      ]
    };
  }
}
