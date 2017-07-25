import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NoContentComponent } from './no-content/no-content.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail/detail.module#DetailModule' },
  { path: 'barrel', loadChildren: './+barrel/barrel.module#BarrelModule' },
  { path: 'rest-test', loadChildren: './+rest-test/rest-test.module#RestTestModule' },
  { path: '**', component: NoContentComponent }
];
