import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { ROUTES } from './app.routes';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLargeDirective } from './home/x-large';
import { AppComponent } from './app.component';
import { ENV_PROVIDERS } from 'shared';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpModule,    
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules })
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NoContentComponent,
    XLargeDirective
  ],
  providers: [
    ENV_PROVIDERS
  ]
})
export class AppModule {
}
