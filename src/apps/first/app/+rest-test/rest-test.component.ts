import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ORIGIN_URL } from 'shared';

@Component({
  selector: 'app-rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent {

  public usersAsync: Promise<User[]>;

  constructor(private http: HttpClient, @Inject(ORIGIN_URL) private baseUrl: string) {
    this.usersAsync = this.getUsers();
  }

  private getUsers() {
    return this.http.get(`${this.baseUrl}/api/test/users`).map(r => r as User[]).toPromise();
  }
}

interface User {
  id: number;
  name: string;
}
