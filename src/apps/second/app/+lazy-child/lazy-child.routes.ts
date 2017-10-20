import { LazyChildComponent } from './lazy-child.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LazyChildComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Child Detail',
        description: 'Child Detail'
      }
    }
  }
];
