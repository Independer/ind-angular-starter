import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppCommonModule } from './app.common.module';
import { AppComponent } from './app.component';
import { ENV_PROVIDERS, SsrBrowserModule } from 'shared';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'second' // make sure this matches with your Server NgModule
    }),
    BrowserAnimationsModule,
    AppCommonModule,

    SsrBrowserModule.forRoot()
  ],
  providers: [
    ENV_PROVIDERS
  ]
})
export class AppBrowserModule {
}
