import { platformBrowser } from '@angular/platform-browser';
import { decorateModuleRef } from './environment.browser';

export function bootstrapAot(moduleFactory: any) {

    function bootApplication(): Promise<any> {
        return platformBrowser()
            .bootstrapModuleFactory(moduleFactory)
            .then(decorateModuleRef)
            .catch(err => console.error(err));
    }

    if (document.readyState === 'complete') {
        bootApplication();
    }
    else {
        document.addEventListener('DOMContentLoaded', bootApplication);
    }
}
