import { Component, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { SsrState, ORIGIN_URL } from 'shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent {

  public usersAsync: Promise<User[]>;

  // Use "constructor"s only for dependency injection
  constructor(private http: Http, @Inject(ORIGIN_URL) private baseUrl: string, private ssrState: SsrState) {
    this.usersAsync = this.getUsers();
  }

  private getUsers() {
    let cachedUsers = this.ssrState.get('Users') as User[];

    if (cachedUsers) {
      console.log('Returning users from cache.');
      return Promise.resolve(cachedUsers);
    }
    else {
      return this.http.get(`${this.baseUrl}/api/test/users`).map(r => r.json() as User[]).toPromise().then(users => {
        this.ssrState.set('Users', users);
        return users;
      });
    }
  }
}

interface User {
  id: number;
  name: string;
}
