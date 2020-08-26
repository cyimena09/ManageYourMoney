import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenses;
  total;
  totalthismonth;
  expenseSubject = new Subject();
  totalSubject = new Subject();
  totalthismonthSubject = new Subject();

  apiURL = 'https://localhost:44390/api/expenses/user/'

  constructor(private userService: UserService, private httpClient: HttpClient) {
    this.loadExpenses();
  }

  loadExpenses(){
    return this.httpClient.get(this.apiURL + '1/' + 'expensesbyyears' ).subscribe(
      (data) => {
        this.expenses = data;
        this.expenseSubject.next(this.expenses);
        this.getYears();
        this.getCategories();
        this.getTotal();
        this.getTotalThisMonth();
      });
  }

  getExpensesList(){
    return this.httpClient.get(this.apiURL + '1/' + 'expenses')
  }

  getExpensesByCategorie(){
    return this.httpClient.get(this.apiURL + '1/' + 'expensesbycategorie')
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
    return this.httpClient.get(this.apiURL + '1/'  + 'categories')
  }

  getTotal(){
    return this.httpClient.get(this.apiURL + '1/' + 'total').subscribe(
      (data) => {this.total = data; this.totalSubject.next(this.total)}
      );
  }

  getTotalThisMonth(){
    return this.httpClient.get(this.apiURL + '1/' + 'totalthismonth').subscribe(
      (data) => {this.totalthismonth = data; this.totalthismonthSubject.next(this.totalthismonth)}
    );
  }

  addExpense(newExpense){
    const date = new Date().getMonth()
    this.httpClient.post(this.apiURL, newExpense).subscribe(
      () => {
        this.loadExpenses();
        this.total += newExpense.amount;
        this.totalSubject.next(this.total)

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
