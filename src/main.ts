import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { decorateModuleRef } from 'shared';

// Update this if you change your root component selector
const rootElemTagName = 'app';

// Boot the application, either now or when the DOM content is loaded
const platform = platformBrowserDynamic();

// Enable either Hot Module Reloading or production mode
const hotModule = module.hot;

if (hotModule) {
  hotModule.accept();
  hotModule.dispose(() => {
    // Workaround for Angular 2.4.6 + HMR problem. See https://github.com/aspnet/JavaScriptServices/commit/e8dd8089d46213f340e565670619b9c05e91d7b0
    // Before restarting the app, we create a new root element and dispose the old one
    const oldRootElem = document.querySelector(rootElemTagName);
    const newRootElem = document.createElement(rootElemTagName);

    if (oldRootElem && oldRootElem.parentNode) {
      oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
    }

    platform.destroy();
  });
}

const bootApplication = () => {
  return platform.bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
};

if (document.readyState === 'complete') {
  bootApplication();
}
else {
  document.addEventListener('DOMContentLoaded', bootApplication);
}
