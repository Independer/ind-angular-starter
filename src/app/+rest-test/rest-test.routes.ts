import { RestTestComponent } from './rest-test.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: RestTestComponent,
        data: {
          meta: {
            title: 'REST Test',
            description: 'REST Test'
          }
        }
      }
    ]
  }
];
