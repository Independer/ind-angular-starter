import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail/detail.module#DetailModule' },
  { path: 'barrel', loadChildren: './+barrel/barrel.module#BarrelModule' },
  { path: '**', component: NoContentComponent }
];
