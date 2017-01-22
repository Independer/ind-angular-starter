import { RestTestComponent } from './rest-test.component';

export const routes = [
  { path: '', children: [
    { path: '', component: RestTestComponent }
  ]}
];
