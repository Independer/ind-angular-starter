import { DetailComponent } from './detail.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: DetailComponent,
        data: {
          meta: {
            title: 'Detail',
            description: 'Detail'
          }
        }
      },
      {
        path: 'child-detail',
        loadChildren: './+child-detail/child-detail.module#ChildDetailModule'
      }
    ]
  }
];
