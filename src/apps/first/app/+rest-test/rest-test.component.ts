import { Component, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { ORIGIN_URL } from 'shared';

@Component({
  selector: 'app-rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent {

  public usersAsync: Promise<User[]>;

  constructor(private http: Http, @Inject(ORIGIN_URL) private baseUrl: string) {
    this.usersAsync = this.getUsers();
  }

  private getUsers() {
    return this.http.get(`${this.baseUrl}/api/test/users`).map(r => r.json() as User[]).toPromise();
  }
}

interface User {
  id: number;
  name: string;
}
