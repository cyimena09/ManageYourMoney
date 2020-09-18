import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL = 'https://apimanageyourmoney.emile404.be/api/users/';
  //apiURL = 'https://localhost:44390/api/users/';

  constructor(private httpClient: HttpClient) { }

  getUsers(){
    return this.httpClient.get(this.apiURL)
  }

  getUser(id){
    return this.httpClient.get(this.apiURL + id)
  }

  createUser(user){
    return this.httpClient.post(this.apiURL, user)
  }

  updateUser(user){
    return this.httpClient.post(this.apiURL + 'update', user);
  }

  updatePs(user){
    return this.httpClient.post(this.apiURL + 'updateps', user);
  }

  removeUser(userid){
    userid = Number(userid);
    return this.httpClient.post(this.apiURL + 'delete', userid);
  }
}
