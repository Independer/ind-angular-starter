import {
  Component,
  OnInit
} from '@angular/core';

console.log('`LazyChild` component loaded asynchronously');

@Component({
  selector: 'app-lazy-child',
  templateUrl: './lazy-child.component.html'
})
export class LazyChildComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `LazyChild` component');
  }

}
