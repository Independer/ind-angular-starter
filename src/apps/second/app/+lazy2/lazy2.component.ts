import {
  Component,
  OnInit
} from '@angular/core';

console.log('`Lazy2` component loaded asynchronously');

@Component({
  selector: 'app-lazy2',
  templateUrl: './lazy2.component.html',
  styleUrls: ['./lazy2.component.scss']
})
export class Lazy2Component implements OnInit {

  public ngOnInit() {
    console.log('hello `Lazy2` component');
  }

}
