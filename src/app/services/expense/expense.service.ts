import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenses;
  categories;
  expenseSubject = new Subject();

  apiURL = 'https://localhost:44390/api/expenses/user/'

  constructor(private userService: UserService, private httpClient: HttpClient) {
    this.loadExpenses();
    this.getCategories();
  }

  loadExpenses(){
    return this.httpClient.get(this.apiURL + '1/' + 'expensesbyyears' ).subscribe(
      (data) => {
        this.expenses = data;
        this.expenseSubject.next(this.expenses);
        this.getYears();
        this.getCategories();
      }
    );
  }

  addExpense(newExpense){
    return this.httpClient.post(this.apiURL, newExpense).subscribe(
      () => {this.loadExpenses()}
    );
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


  getCategorieForChart(){
    const categorieTable = [];
    const nbData = this.userService.user.expenses.length;
    for (let i = 0; i< nbData; i++){
      const cat = this.userService.user.expenses[i].categorie
      if (!categorieTable.includes(cat)){
        categorieTable.push(cat)
      }
    }
    return categorieTable
  }

  getCategorieForEncoding(){
    return this.userService.user.expenseCategories
  }

  getExpenseByCategorie(){
    // retourne un dictionnaire avec en clé la catégorie et en valeur le total des dépenses de cette catégorie
    const listCategorie = this.getCategorieForChart();
    const dict = {};
    const nbData = this.userService.user.expenses.length;
    listCategorie.forEach(
      (element) => {
        let sums = 0;
        for (let i = 0; i < nbData; i++){
          if (element === this.userService.user.expenses[i].categorie ){
            sums += this.userService.user.expenses[i].amount
          }
        }
        dict[element] = sums
      }
    );
    return dict
  }


  getDataExpensesForChart(){
    // retourne un tableau de taille 12 colonnes avec toutes les dépenses pour un an
    const dataTable = [];
    for (let i = 0; i< 12; i++){
      const amount = this.getExpensesForOneMonth(i)
      dataTable.push(amount)
    }
    return dataTable
  }

  getExpensesForOneMonth(month){
    // on a d'abord besoin de récupérer tous les mois concernés
    let sums = 0;
    const nbData = this.userService.user.expenses.length
    for (let i = 0;i < nbData; i++){
      let apiDate = new Date(this.userService.user.expenses[i].date)
      const apiMonth = apiDate.getMonth();
      if (apiMonth === month){
        sums += this.userService.user.expenses[i].amount
      }
    }
    return sums
  }

  totalExpenses(){
    let sums = 0;
    const nb = this.userService.user.expenses.length
    for (let i = 0; i < nb; i++){
      sums += this.userService.user.expenses[i].amount
    }
    return sums
  }

  getOldestDate(){
    // retourne la date la différence entre la date la plus ancienne et le 1/1/1970
    let oldestDate = new Date().valueOf();
    const nb = this.userService.user.expenses.length
    for (let i = 0; i < nb; i++){
      let datetime = new Date(this.userService.user.expenses[i].date)
      let dateTest = datetime.valueOf()
      if(dateTest < oldestDate){
        oldestDate = dateTest
      }
    }
    return  oldestDate;
  }

  spentDay(){
    // cette fonction retourne le nombre de jour passé depuis la première dépense
    const oldestDate = this.getOldestDate();
    const actualDate = new Date().valueOf();

    return Math.round((actualDate - oldestDate) / 86400000);
  }

  spentMonth(){
    // cette fonction retourne le nombre de mois passé depuis la première dépense
    return this.spentDay()/30.41; // gérer la division en fonction du mois
  }

  getAverageByDay() {
    return this.totalExpenses() / this.spentDay()
  }

  getAverageByMonth(){
    return this.totalExpenses()/this.spentMonth();
  }

  getAverageThisMonth(){
    const nbDay = new Date().getDay();
    return this.getExpenseThisMonth()/nbDay;
  }

  getExpenseLastMonth(){
    const lastMonth = new Date().getMonth() - 1;
    return this.getExpensesForOneMonth(lastMonth);
  }

  getExpenseThisMonth(){
    const thisMonth = new Date().getMonth();
    return this.getExpensesForOneMonth(thisMonth)
  }

  getAverageDiff(){
    return this.getAverageByMonth() - this.getAverageThisMonth();
  }
}
