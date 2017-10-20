import {
  Component,
  OnInit
} from '@angular/core';
import { AboutService } from 'shared';

@Component({
  selector: 'app-home',
  providers: [
    AboutService
  ],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    public title: AboutService
  ) {}

  public ngOnInit() {
    console.log('hello `Home` component');
  }
}
