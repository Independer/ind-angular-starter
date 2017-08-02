import 'zone.js/dist/zone-node';
import './polyfills.server';
import { enableProdMode, NgModuleFactory, Type } from '@angular/core';
import { createServerRenderer } from 'aspnet-prerendering';
import { ngAspnetCoreEngine, IEngineOptions } from './temporary-aspnetcore-engine';

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
      ]
    };

    return ngAspnetCoreEngine(setupOptions);
  });

  return renderer;
}
