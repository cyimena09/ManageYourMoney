import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser;
  tokenString = localStorage.getItem('token');
  userSubject;
  invalid = false;
  invalidSubject = new Subject();

  //apiURL = 'https://apimanageyourmoney.emile404.be/api/auth/';
  apiURL = 'https://localhost:44390/api/auth/';

  constructor(private httpClient: HttpClient, private router: Router) {
    if (this.tokenString != null){
      this.userSubject =  new BehaviorSubject(jwt_decode(this.tokenString))
    }
    else {
      this.userSubject = new BehaviorSubject(null)
    }
    this.userSubject.subscribe(
      (data) => {this.currentUser = data}
      );
  }

  login(logger){
    this.invalidSubject.next(false)
    this.httpClient.post(this.apiURL + 'login', logger, {responseType: 'text'}).subscribe(
      (tokenString) => {
        localStorage.setItem('token', tokenString);
        this.userSubject.next(jwt_decode(tokenString));
        this.router.navigate(['/managment']);
        this.invalid = false; this.invalidSubject.next(this.invalid);
      },
      () => {this.invalid = true; this.invalidSubject.next(this.invalid)}
    );
  }

  logout(){
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/managment']);
  }

  updateToken(userid){
    userid = Number(userid);
    this.httpClient.post(this.apiURL + 'updatetoken', userid, {responseType: 'text'}).subscribe(
      (tokenString) => {
        localStorage.removeItem('token');
        localStorage.setItem('token', tokenString);
      });
  }

}
