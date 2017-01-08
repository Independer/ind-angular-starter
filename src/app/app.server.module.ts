
import { NgModule } from '@angular/core';
// for AoT we need to manually split universal packages (/browser & /node)
import { UniversalModule } from 'angular2-universal/node';

import { AppCommonModule } from './app.common.module';
import { AppComponent } from './app.component';

export function getRequest() {
  return Zone.current.get('req') || {};
}
export function getResponse() {
  return Zone.current.get('res') || {};
}

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        // "UniversalModule" Must be first import.
        // ** NOTE ** : This automatically imports BrowserModule, HttpModule, and JsonpModule for Browser,
        // and NodeModule, NodeHttpModule etc for the server.
        UniversalModule, 

        AppCommonModule
    ],
    providers: [
    ]
})
export class AppServerModule {
}
