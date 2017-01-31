import { Component, OnInit } from '@angular/core';
import { HttpCacheService } from 'shared';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent implements OnInit {

  public users: User[];

  // Use "constructor"s only for dependency injection
  constructor(private httpCache: HttpCacheService) { }

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  async ngOnInit() {
    this.users = await this.httpCache.get('/api/test/users').toPromise();
  }
}

interface User {
  id: number;
  name: string;
}
