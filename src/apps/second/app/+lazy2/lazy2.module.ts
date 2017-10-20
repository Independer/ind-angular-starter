import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './lazy2.routes';
import { Lazy2Component } from './lazy2.component';
import { SharedComponentModule } from 'shared';
import { SharedModule } from 'second/shared';

console.log('`Lazy2` bundle loaded asynchronously');

@NgModule({
  declarations: [
    Lazy2Component
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SharedComponentModule
  ]
})
export class Lazy2Module {
  public static routes = routes;
}
