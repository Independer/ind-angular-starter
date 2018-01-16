import { NgModule } from '@angular/core';
import { NotImplementedSsrData, ssrDataToken } from './ssr-data';
import { PlatformService } from './platform.service';
import { ORIGIN_URL } from './origin-url-token';
import { LOCATION } from './location-info-token';

@NgModule({
  providers: [
    PlatformService
  ]
})
export class SsrBrowserModule {
  static forRoot() {
    return {
      ngModule: SsrBrowserModule,
      providers: [
        {
          provide: ssrDataToken,
          useFactory: getBrowserSsrData
        },
        {
          // We need this for our Http calls since they'll be using an ORIGIN_URL provided in apsnetcore-engine
          // (Also remember the Server requires Absolute URLs)
          provide: ORIGIN_URL,
          useFactory: getBrowserOriginUrl
        },
        { provide: LOCATION, useFactory: getBrowserLocation }
      ]
    };
  }
}

export function getBrowserOriginUrl() {
  return '';
}

export function getBrowserLocation() {
  return window.location;
}

export function getBrowserSsrData() {
  return NotImplementedSsrData.instance;
}


