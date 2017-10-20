import { Lazy2Component } from './lazy2.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: Lazy2Component,
        data: {
          meta: {
            title: 'Lazy2',
            description: 'Lazy2'
          }
        }
      },
      {
        path: 'lazy-child',
        loadChildren: '../+lazy-child/lazy-child.module#LazyChildModule'
      }
    ]
  }
];
