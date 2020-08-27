import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  incomes;
  total;
  dateDiff;
  average;
  totalthismonth;
  currentUser
  incomeSubject = new Subject();
  totalSubject = new Subject();
  dateDiffSubject = new Subject();
  totalthismonthSubject = new Subject();

  apiURL = 'https://localhost:44390/api/incomes/user/'

  constructor(private userService: UserService, private httpClient: HttpClient, private authService: AuthService) {
    this.authService.userSubject.subscribe(
      (data) => { this.currentUser = data;
        if(this.currentUser != null){
          this.loadIncomes();
        }
      }
    );

  }

  loadIncomes(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/incomesbyyears' ).subscribe(
      (data) => {
        this.incomes = data;
        this.incomeSubject.next(this.incomes);
        this.getYears();
        this.getCategories();
        this.getTotal();
        this.getDateDiff();
        this.getTotalThisMonth();
      });
  }

  getIncomesList(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/incomes')
  }

  getIncomesByCategorie(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/incomesbycategorie')
  }

  getYears(){
    const years = [];
    const nbData = this.incomes.length;
    for (let i = 0; i< nbData; i++){
      const year = this.incomes[i].year
      if (!years.includes(year)){
        years.push(year)
      }
    }
    years.sort();
    return years
  }

  getCategories(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID  + '/categories');
  }

  getTotal(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/total').subscribe(
      (data) => {this.total = data; this.totalSubject.next(this.total)
      if(typeof this.dateDiff != 'undefined'){
        this.average = Math.round((this.total / this.dateDiff)*100) /100
      }}
    );
  }

   getDateDiff(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/datediff').subscribe(
      (data) => {
        this.dateDiff = data;
        this.dateDiffSubject.next(this.dateDiff);
        if(typeof this.total != 'undefined'){
        this.average = Math.round((this.total / this.dateDiff)*100) /100
      }
      }
    );
  }

  getTotalThisMonth(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/totalthismonth').subscribe(
      (data) => {this.totalthismonth = data; this.totalthismonthSubject.next(this.totalthismonth)}
    )
  }

  addIncome(newIncome){
    const date = new Date().getMonth()
    this.httpClient.post(this.apiURL, newIncome).subscribe(
      () => {
        this.loadIncomes();
        this.total += newIncome.amount;
        this.totalSubject.next(this.total)

        if(date === newIncome.date.getMonth()){
          this.totalthismonth += newIncome.amount;
          this.totalthismonthSubject.next(this.totalthismonth)
        }
      });
  }

  removeIncome(incomeid){
    return this.httpClient.delete(this.apiURL + incomeid)
  }

}
