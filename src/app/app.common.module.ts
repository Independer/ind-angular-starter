
/*
 * _Common_ NgModule to share between our "BASE" App.Browser & App.Server module platforms
 *
 *  If something belongs to BOTH, just put it Here.
 * - If you need something to be very "platform"-specific, put it 
 *   in the specific one (app.browser or app.server)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';
import { HttpCacheService, CacheService } from 'shared';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here  
  CommonModule,
  RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
];

const PIPES: any[] = [
  // put pipes here
];

const COMPONENTS = [
  // put shared components here
  AppComponent,
  AboutComponent,
  HomeComponent,
  NoContentComponent,
  XLargeDirective
];

const PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  HttpCacheService,
  CacheService
];

@NgModule({
  // bootstrap: [AppComponent],
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class AppCommonModule { }
