import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';
import { MetaGuard } from '@ngx-meta/core';

export const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: 'Sweet home',
        description: 'Home, home sweet home... and what?'
      }
    }
  },
  {
    path: 'rest-test',
    loadChildren: './+rest-test/rest-test.module#RestTestModule'
  },
  {
    path: '**',
    component: NoContentComponent,
    canActivate: [MetaGuard],
    data: {
      meta: {
        title: '404',
        description: 'Page not found'
      }
    }
  }
];
