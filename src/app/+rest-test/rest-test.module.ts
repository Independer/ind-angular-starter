import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestTestComponent } from './rest-test.component';
import { routes } from './rest-test.routes';

console.log('`RestTest` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    RestTestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class RestTestModule {}
