import { ChildBarrelComponent } from './child-barrel.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChildBarrelComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Child Barrel',
        description: 'Child Barrel'
      }
    }
  }
];
