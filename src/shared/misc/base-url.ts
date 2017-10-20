import { InjectionToken } from '@angular/core';
import { ssrDataToken, SsrData, PlatformService } from '../ssr';

export const baseUrlToken = new InjectionToken<string>('BASE_URL');

export function getBaseUrl(platformService: PlatformService, ssrData: SsrData) {
  if (platformService.isBrowser()) {
    return document.getElementsByTagName('base')[0].getAttribute('href');
  }
  else {
    return ssrData.baseUrl;
  }
}

export const baseUrlProvider = [
  { provide: baseUrlToken, useFactory: getBaseUrl, deps: [PlatformService, ssrDataToken] }
];
