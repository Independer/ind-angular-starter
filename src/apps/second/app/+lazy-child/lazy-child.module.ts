import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './lazy-child.routes';
import { LazyChildComponent } from './lazy-child.component';
import { SharedModule } from 'second/shared';

console.log('`Detail` bundle loaded asynchronously');

@NgModule({
  declarations: [
    LazyChildComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LazyChildModule {
}
