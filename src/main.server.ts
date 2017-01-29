import 'angular2-universal-polyfills/node'; // HAS TO BE THE FIRST IMPORT IN THIS FILE - Workaround for https://github.com/angular/angular/issues/13609
import './__2.1.1.workaround'; // temporary until 2.1.1 things are patched in Core. See https://github.com/angular/universal/issues/606
import 'ts-helpers';
import 'zone.js';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { enableProdMode } from '@angular/core';
import { platformNodeDynamic } from 'angular2-universal';
import { AppServerModule } from './app/app.server.module';

enableProdMode();
const platform = platformNodeDynamic();

// tslint:disable-next-line:no-default-export
export default createServerRenderer(params => {
  return new Promise<RenderResult>((resolve, reject) => {
    const requestZone = Zone.current.fork({
      name: 'angular-universal request',
      properties: {
        baseUrl: '/',
        requestUrl: params.url,
        originUrl: params.origin,
        preboot: false,
        document: '<app></app>'
      },
      onHandleError: (parentZone, currentZone, targetZone, error) => {
        // If any error occurs while rendering the module, reject the whole operation
        reject(error);
        return true;
      }
    });

    return requestZone.run<Promise<string>>(() => platform.serializeModule(AppServerModule)).then(html => {
      resolve({ html: html });
    }, reject);
  });
});
