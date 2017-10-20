import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestTestComponent } from './rest-test.component';
import { routes } from './rest-test.routes';
import { SharedModule } from 'first/shared';

console.log('`RestTest` bundle loaded asynchronously');

@NgModule({
  declarations: [
    RestTestComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RestTestModule {}
