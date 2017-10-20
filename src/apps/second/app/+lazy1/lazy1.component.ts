import {
  Component,
  OnInit
} from '@angular/core';

console.log('`Lazy1` component loaded asynchronously');

@Component({
  selector: 'app-lazy1',
  templateUrl: './lazy1.component.html',
  styleUrls: ['./lazy1.component.scss']
})
export class Lazy1Component implements OnInit {

  public ngOnInit() {
    console.log('hello `Lazy1` component');
  }

}
