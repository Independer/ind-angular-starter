import { Component } from '@angular/core';
import { AppState } from './app.service';

import '../styles/app.scss';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public angularLogo = 'assets/img/angular-logo.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://www.independer.nl';

  constructor(
    public appState: AppState
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }
}
