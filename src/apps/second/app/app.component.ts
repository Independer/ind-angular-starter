import { Component, OnInit } from '@angular/core';
import { AboutService } from 'shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public titleService: AboutService) {
  }

  public ngOnInit() {
    console.log('AppComponent ngOnInit');
  }
}
