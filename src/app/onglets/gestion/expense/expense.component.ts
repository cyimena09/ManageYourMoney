import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {NgForm} from '@angular/forms';
import {Expense} from '../../../models/expense';
import {UserService} from '../../../services/user/user.service';
import {ExpenseService} from '../../../services/expense/expense.service';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  currentUser
  activated = true;
  expenses;
  years;
  categories:any = [];
  totalthismonth;
  totallastmonth;
  difference;
  total;
  dateDiff;
  average;
  actualDate = Date.now();
  lastDate = this.getLastMonth();
  newCategory: boolean;
  categoryName

  // graph parameter
  canvas:any;
  ctx;
  myChartLine;
  //check encoding
  invalid: boolean = false;

  constructor(private userService: UserService, private expenseService: ExpenseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser
    this.canvas = document.getElementById("expenses_graph");
    this.expenses = this.expenseService.expenses;
    this.total = this.expenseService.total;
    this.dateDiff = this.expenseService.dateDiff;
    this.average = this.expenseService.average;
    this.totalthismonth = this.expenseService.totalthismonth;
    this.totallastmonth = this.expenseService.totallastmonth;
    this.categories = this.expenseService.categories
    this.difference = this.difference = Math.round((((this.totalthismonth - this.totallastmonth) / this.totallastmonth) * 100)*100)/100 ;


    this.expenseService.expenseSubject.subscribe(
      (data) => {
        this.expenses = data;
        this.years = this.expenseService.getYears();
        this.getDataSets();
        this.loadChart();
      });

    this.expenseService.totalSubject.subscribe(
      (data) => {
        this.total = data;
        if(typeof this.total !== 'undefined' && typeof this.dateDiff !== 'undefined'){
          this.average = Math.round((this.total / this.dateDiff)*100) /100 ;
        }
      });

    this.expenseService.dateDiffSubject.subscribe(
      (data) => {
        this.dateDiff = data;
        if(typeof this.total !== 'undefined' && typeof this.dateDiff !== 'undefined'){
          this.average = Math.round((this.total / this.dateDiff)*100) /100 ;
        }
      });

    this.expenseService.totalthismonthSubject.subscribe(
      (data) => {this.totalthismonth = data; this.difference =  this.getdifference();}
    );

    this.expenseService.totallastmonthSubject.subscribe(
      (data) => {this.totallastmonth = data; this.difference = this.getdifference();}
    );

    this.expenseService.categorySubject.subscribe(
      (data) => {this.categories = data}
    );

    this.authService.userSubject.subscribe(
      (data) => { this.currentUser = data;
        if(this.currentUser == null){
          this.getDataSets();
          this.loadChart()
        }
      }
    );

    if(typeof this.expenses !== 'undefined'){
      this.years = this.expenseService.getYears();
      this.getDataSets();
      this.loadChart()
    }
  }


  //****************************************************--- METHOD ---***************************************************************

  getLastMonth(){
    const table = ['janvier', 'février', 'mars', 'avril','mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    const date = new Date().getMonth()
    return table[date - 1]
  }

  getdifference(){
    if(this.totallastmonth == 0){
      return 0
    }
    else{
      return Math.round((((this.totalthismonth - this.totallastmonth) / this.totallastmonth) * 100)*100)/100 ;
    }
  }

  getDataSets(){
    if(this.currentUser == null){
      if(typeof this.myChartLine !== 'undefined'){
        this.myChartLine.destroy();
        this.average = 0;
        this.total = 0;
        this.totalthismonth = 0;
      }
      return 0
    }

    const nbyears = this.years.length
    const nbamount = this.expenses.length
    const dataSets = []
    let hidden = true

    for(let i = 0; i < nbyears; i++){
      let color
      if(i == nbyears - 1){
        color = '#ffffff';
      }
      else {
        color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      }
      let amountbymonth = [0,0,0,0,0,0,0,0,0,0,0,0];
      for(let j = 0; j< nbamount; j++){
        if(this.expenses[j].year == this.years[i]){
          const month = this.expenses[j].month
          amountbymonth[month - 1] = this.expenses[j].amount
        }
      }
      if(i + 1 == nbyears){
        hidden = false
      }
      const data = {
          label: this.years[i],
        hidden: hidden,
          fill: true,
          borderColor: color,
          borderWidth: 2,
          pointBackgroundColor: color,
          pointHoverBackgroundColor: color,
          pointBorderWidth: 4,
          pointHoverRadius: 6,
          data: amountbymonth
        }
        dataSets.push(data)
    }
    return dataSets
  }

  loadChart(){
    this.ctx = this.canvas.getContext("2d")

    const month_labels = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOUT', 'SEPT', 'OCT', 'NOV', 'DEC'];

    const config = {
      type: 'line',
      data: {
        labels: month_labels,
        datasets: this.getDataSets()
      },
      options: {
        scales: {
          xAxes: [{ticks: {fontColor: 'white'}}],
          yAxes: [ {ticks: {fontColor: 'white'}}]
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontsize: '25px'
          }
        }
      }
    };
    this.myChartLine = new Chart(this.ctx, config)
  }

  onAddExpense(form: NgForm){
    this.invalid = false;
    let amount = form.value['amount'];
    amount = Number(amount);

    if(isNaN(amount)){
      const focusamount = document.getElementById('amount-expense');
      focusamount.style.border = 'red solid'
      return this.invalid = true;

    }
    else{
      const newExpense = new Expense();
      const category = form.value['category'];
      const date = form.value['date']

      if(this.newCategory){
        newExpense.category = this.categoryName;
      }
      else{
        if (category == ""){
          newExpense.category = "Autre";
          this.categories.push("Autre")
        }
        else{
          newExpense.category = category;
        }
      }
      newExpense.amount = amount;
      newExpense.date = new Date(date);
      newExpense.userID = Number(this.currentUser.UserID);

      this.expenseService.addExpense(newExpense);
      this.myChartLine.destroy();
    }
  }

  onAddCategory(){
    if(this.newCategory){
      if(this.categoryName != null){
        this.categories.push(this.categoryName);
      }
      this.newCategory = !this.newCategory;
    }
    else{
      this.newCategory = !this.newCategory;
    }
  }
}
