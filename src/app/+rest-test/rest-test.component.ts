import { Component, OnInit } from '@angular/core';
import { HttpCacheService } from 'shared';

@Component({
  selector: 'rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent implements OnInit {

  public users: User[];

  // Use "constructor"s only for dependency injection
  constructor(private _httpCache: HttpCacheService) { }

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  ngOnInit() {
    this._httpCache.get('/api/test/users').subscribe(result => {
      this.users = result;
    });
  }
}

interface User {
  id: number;
  name: string;
}
