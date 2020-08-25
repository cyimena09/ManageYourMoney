import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import Chart from 'chart.js';
import {NgForm} from '@angular/forms';
import {Expense} from '../models/expense';
import {UserService} from '../services/user/user.service';
import {ExpenseService} from '../services/expense/expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  @Output() updateSolde = new EventEmitter();
  activated = true

  expenses
  years
  categories;

  newCategorie = false



  actualDate = Date.now();
  totalExpenses: number;
  expensesByDay;
  expenseThisMonth;
  expenseLastMont;
  averageByMonth;
  averageDiff;
  absAverageDiff;
  dataIncomesForChart;

  // graph parameter
  canvas:any;
  ctx;
  myChartLine;

  constructor(private userService: UserService, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.expenses = this.expenseService.expenses;
    this.expenseService.expenseSubject.subscribe(
      (data) => {this.expenses = data; this.years = this.expenseService.getYears(); this.getDataSets(); this.loadChart();}
    );

    this.expenseService.getCategories().subscribe(
      (data) => {this.categories = data;}
    );
  }

  onActivated(){
    if(this.activated){
      document.getElementById('expenses_graph').style.display = 'none';
    }
    else {
      document.getElementById('expenses_graph').style.display = 'block';
    }
    this.activated = !this.activated
  }

  getAverageForChart(){
    const table = [];
    let average =  this.expenseService.getAverageByMonth();
    average = Math.round(average*100)/100

    for (let i = 0; i<12;i++){
      table.push(average)
    }
    return table
  }

  getDataSets(){
    const nbyears = this.years.length
    const nbamount = this.expenses.length
    const dataSets = []
    let hidden = true

    for(let i = 0; i < nbyears; i++){
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
          borderColor: '#ffffff',
          borderWidth: 2,
          pointBackgroundColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointBorderWidth: 4,
          pointHoverRadius: 6,
          data: amountbymonth
        }
        dataSets.push(data)
    }
    return dataSets
  }


  loadChart(){
    this.canvas = document.getElementById("expenses_graph");
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
    let amount = form.value['amount'];
    amount = Number(amount)
    const categorie = form.value['categorie'];
    const date = form.value['date']
    const newExpense = new Expense();
    newExpense.amount = amount;

    if (categorie == ""){
      newExpense.categorie = "Autre";
      this.categories.push("Autre")
    }
    else{
      newExpense.categorie = categorie;
    }
    newExpense.date = new Date(date);
    newExpense.userID = 1
    this.expenseService.addExpense(newExpense);
    this.myChartLine.destroy();
  }

  onAddCategorie(){
    this.newCategorie = !this.newCategorie;
  }

  onSaveCategorie(form: NgForm){
    const newCat = form.value['categorie'];
    this.categories.push(newCat);
    form.reset();
  }
}
