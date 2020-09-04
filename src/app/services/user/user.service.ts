import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //apiURL = 'https://apimanageyourmoney.emile404.be/api/users/';
  apiURL = 'https://localhost:44390/api/users/';

  constructor(private httpClient: HttpClient) {

  }


  createUser(user){
    return this.httpClient.post(this.apiURL, user)
  }
}
