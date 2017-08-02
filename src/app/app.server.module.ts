import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SsrStateInjector, SsrStateModule } from 'shared';
import { AppCommonModule } from './app.common.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'ind-angular-starter' // make sure this matches with your Browser NgModule
    }),
    ServerModule,
    NoopAnimationsModule,

    SsrStateModule.forServer(),

    // Our Common AppBrowserModule
    AppCommonModule
  ]
})
export class AppServerModule {
  constructor(private ssrStateInjector: SsrStateInjector) { }

  // Gotcha (needs to be an arrow function)
  ngOnBootstrap = () => {
    this.ssrStateInjector.inject();
  }
}
