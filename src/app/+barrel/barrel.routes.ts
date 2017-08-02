import { BarrelComponent } from './barrel.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    canActivateChild: [MetaGuard],
    children: [
      {
        path: '',
        component: BarrelComponent,
        data: {
          meta: {
            title: 'Barrel',
            description: 'Barrel'
          }
        }
      },
      {
        path: 'child-barrel',
        loadChildren: './+child-barrel/child-barrel.module#ChildBarrelModule'
      }
    ]
  }
];
