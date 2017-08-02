import { ChildDetailComponent } from './child-detail.component';
import { MetaGuard } from '@ngx-meta/core';

export const routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChildDetailComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Child Detail',
        description: 'Child Detail'
      }
    }
  }
];
