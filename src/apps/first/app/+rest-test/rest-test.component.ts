import { Component, Inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/src/tokens';

@Component({
  selector: 'app-rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent {

  public usersAsync: Promise<User[]>;

  private baseUrl: string;

  constructor(private http: HttpClient, private injector: Injector) {
    this.baseUrl = injector.get(ORIGIN_URL);
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
