import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ENV_PROVIDERS, SsrStateModule, ORIGIN_URL } from 'shared';
import { AppCommonModule } from './app.common.module';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
     BrowserModule.withServerTransition({
        appId: 'ind-angular-starter' // make sure this matches with your Server NgModule
    }),
    BrowserAnimationsModule,
    SsrStateModule.forBrowser(),

    AppCommonModule
  ],
  declarations: [
  ],
  providers: [
    ...ENV_PROVIDERS,
    {
      // We need this for our Http calls since they'll be using an ORIGIN_URL provided in main.server
      // (Also remember the Server requires Absolute URLs)
      provide: ORIGIN_URL,
      useFactory: (getOriginUrl)
    }
  ]
})
export class AppBrowserModule {
}

export function getOriginUrl() {
  return '';
}
