import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user;
  apiUrl = 'http://localhost:3000/users/1';

  constructor(private httpClient: HttpClient) {

  }

  getUser(){
    return this.httpClient.get(this.apiUrl).subscribe(
      (data) => this.user = data
    );
  }

  saveUser(user){
    return this.httpClient.put(this.apiUrl, user).subscribe();
  }
}
