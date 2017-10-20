import { Lazy1Component } from './lazy1.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: Lazy1Component,
        data: {
          meta: {
            title: 'Lazy1',
            description: 'Lazy1'
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
