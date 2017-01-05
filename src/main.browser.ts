// import 'angular2-universal-polyfills/browser';
import { enableProdMode } from '@angular/core';
import { platformUniversalDynamic } from 'angular2-universal';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app';
import { decorateModuleRef } from './app/environment';

// Enable either Hot Module Reloading or production mode
if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => { platform.destroy(); });
} else {
    enableProdMode();
}

// Boot the application, either now or when the DOM content is loaded
const platform = platformBrowserDynamic();
const bootApplication = () => { platform.bootstrapModule(AppModule).then(decorateModuleRef).catch((err) => console.error(err)); };
if (document.readyState === 'complete') {
    bootApplication();
} else {
    document.addEventListener('DOMContentLoaded', bootApplication);
}
