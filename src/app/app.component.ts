import { Component, OnInit } from '@angular/core';

import '../styles/app.scss';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public angularLogo = 'assets/img/angular-logo.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://www.independer.nl';

  public ngOnInit() {
    console.log('AppComponent ngOnInit');
  }
}
