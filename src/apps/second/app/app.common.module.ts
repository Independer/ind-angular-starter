
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

import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { AboutModule, AboutService, XLargeModule } from 'shared';
import { SharedModule } from './shared';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // bootstrap: [AppComponent],
  imports: [
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: createMetaLoader,
      deps: [AboutService]
    }),
    AboutModule.forRoot(),
    XLargeModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NoContentComponent
  ],
  providers: [
  ]
})
export class AppCommonModule { }

export function createMetaLoader(aboutService: AboutService): MetaLoader {
  return new MetaStaticLoader({
    pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
    pageTitleSeparator: ' - ',
    applicationName: aboutService.title,
    defaults: {
      title: '',
      description: 'Mighty Mouse is an animated superhero mouse character',
      'og:image': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/superraton.jpg',
      'og:type': 'website',
      'og:locale': 'en_US',
      'og:locale:alternate': 'en_US,nl_NL,tr_TR'
    }
  });
}
