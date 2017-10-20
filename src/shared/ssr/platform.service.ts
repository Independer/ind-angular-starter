import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/**
 * Provides a possibility to determine whether the application is running on the server (in Node) during server-side rendering or
 * in the browser.
 */
@Injectable()
export class PlatformService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {

  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}
