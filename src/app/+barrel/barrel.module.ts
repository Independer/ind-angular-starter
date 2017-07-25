import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './barrel.routes';
import { BarrelComponent } from './barrel.component';
import { SharedComponentModule } from 'shared';

console.log('`Barrel` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    BarrelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedComponentModule
  ]
})
export class BarrelModule {
  public static routes = routes;
}
