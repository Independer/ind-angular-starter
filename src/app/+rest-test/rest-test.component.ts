import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';

@Component({
  selector: 'rest-test',
  templateUrl: './rest-test.component.html'
})
export class RestTestComponent implements OnInit {

  public users: User[];

  // Use "constructor"s only for dependency injection
  constructor(private http: Http) { }

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  async ngOnInit() {
    let response = await this.http.get('/api/test/users').toPromise();
    this.users = response.json();
  }
}

interface User {
  id: number;
  name: string;
}
