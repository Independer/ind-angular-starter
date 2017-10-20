import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './environment.browser';

export function bootstrapJit(appModule: any) {
  const platform = platformBrowserDynamic();

  const bootApplication = () => {
    return platform.bootstrapModule(appModule)
      .then(decorateModuleRef)
      .catch(err => console.error(err));
  };

  if (document.readyState === 'complete') {
    bootApplication();
  }
  else {
    document.addEventListener('DOMContentLoaded', bootApplication);
  }
}
