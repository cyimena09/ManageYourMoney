import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  currentUser;
  expenses;
  total;
  average;
  dateDiff;
  totalthismonth;
  expenseSubject = new Subject();
  totalSubject = new Subject();
  dateDiffSubject = new Subject();
  totalthismonthSubject = new Subject();

  apiURL = 'https://localhost:44390/api/expenses/user/'

  constructor(private userService: UserService, private httpClient: HttpClient, private authService: AuthService) {
    this.authService.userSubject.subscribe(
      (data) => { this.currentUser = data;
        if(this.currentUser != null){
          this.loadExpenses();
        }
      }
    );
  }

  loadExpenses(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/expensesbyyears' ).subscribe(
      (data) => {
        this.expenses = data;
        this.expenseSubject.next(this.expenses);
        this.getYears();
        this.getCategories();
        this.getTotal();
        this.getDateDiff();
        this.getTotalThisMonth();
      });
  }

  getExpensesList(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/expenses')
  }

  getExpensesByCategorie(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/expensesbycategorie')
  }

  getYears(){
    const years = [];
    const nbData = this.expenses.length;
    for (let i = 0; i< nbData; i++){
      const year = this.expenses[i].year
      if (!years.includes(year)){
        years.push(year)
      }
    }
    years.sort();
    return years
  }

  getCategories(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID  + '/categories')
  }

  getTotal(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/total').subscribe(
      (data) => {
        this.total = data;
        this.totalSubject.next(this.total);
        if(typeof this.dateDiff != 'undefined'){
          this.average = Math.round((this.total / this.dateDiff)*100) /100;
        }
      });
  }

  getDateDiff(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/datediff').subscribe(
      (data) => {
        this.dateDiff = data; this.dateDiffSubject.next(this.dateDiff);
        if(typeof this.total != 'undefined'){
        this.average =Math.round((this.total / this.dateDiff)*100) /100;
        }
      });
  }

  getTotalThisMonth(){
    return this.httpClient.get(this.apiURL + this.currentUser.UserID + '/totalthismonth').subscribe(
      (data) => {this.totalthismonth = data; this.totalthismonthSubject.next(this.totalthismonth)}
    );
  }

  addExpense(newExpense){
    const date = new Date().getMonth()
    this.httpClient.post(this.apiURL, newExpense).subscribe(
      () => {
        this.loadExpenses();
        this.total += newExpense.amount;
        this.totalSubject.next(this.total);
        this.dateDiffSubject.next(this.dateDiff)

        if(date === newExpense.date.getMonth()){
          this.totalthismonth += newExpense.amount;
          this.totalthismonthSubject.next(this.totalthismonth)
        }
      });
  }

  removeExpense(expenseid){
    return this.httpClient.delete(this.apiURL + expenseid)
  }

}
