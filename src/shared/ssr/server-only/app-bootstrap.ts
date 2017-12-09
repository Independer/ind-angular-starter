import { enableProdMode, NgModuleFactory, Type } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { createServerRenderer } from 'aspnet-prerendering';
import { ngAspnetCoreEngine, IEngineOptions } from '@nguniversal/aspnetcore-engine';
import { ssrDataToken } from '../ssr-data';
import { LOCATION } from '../location-info-token';

export function bootstrapServer(ngModule: Type<{}> | NgModuleFactory<{}>) {
  enableProdMode();

  let renderer = createServerRenderer(params => {
    // Platform-server provider configuration
    const setupOptions: IEngineOptions = {
      appSelector: '<app></app>',
      ngModule: ngModule,
      request: params,
      providers: [
        // Optional - Any other Server providers you want to pass (remember you'll have to provide them for the Browser as well)
        { provide: ssrDataToken, useValue: params.data },
        { provide: LOCATION, useValue: params.location },

        // This is needed for the router to correctly resolve router links relative to the app path, for example
        // if there is a router link "/lazy-route" inside the "first" app then the rendered <a> tag should contain
        // href="/first/lazy-route". If this token is not provided, then the <a> tag will contain only "/lazy-route".
        { provide: APP_BASE_HREF, useValue: params.baseUrl } 
      ]
    };

    return ngAspnetCoreEngine(setupOptions);
  });

  return renderer;
}
