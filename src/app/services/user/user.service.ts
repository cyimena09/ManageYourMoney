import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'https://localhost:44390/api/users';

  constructor(private httpClient: HttpClient) {

  }


  createUser(user){
    return this.httpClient.post(this.apiUrl, user)
  }
}
