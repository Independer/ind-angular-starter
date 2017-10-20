import { enableProdMode, NgModuleFactory, Type } from '@angular/core';
import { createServerRenderer } from 'aspnet-prerendering';
import { ngAspnetCoreEngine, IEngineOptions } from './aspnetcore-engine-temp';
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
        { provide: LOCATION, useValue: params.location }
      ]
    };

    return ngAspnetCoreEngine(setupOptions);
  });

  return renderer;
}
