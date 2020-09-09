import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {IncomeService} from '../services/income/income.service';
import {ExpenseService} from '../services/expense/expense.service';
import {AuthService} from '../services/auth/auth.service';
import {RegisterService} from '../services/register/register.service';
import {OngletService} from '../services/onglet/onglet.service';


@Component({
  selector: 'app-solde',
  templateUrl: './solde.component.html',
  styleUrls: ['./solde.component.scss']
})
export class SoldeComponent implements OnInit {
  currentUser
  years;
  incomes
  expenses
  canvas;
  ctx;
  myChartData;

  constructor( private incomeService: IncomeService,
               private expenseService: ExpenseService, private authService: AuthService,
               private registerService: RegisterService,
               private ongletService: OngletService) { }

  ngOnInit(): void {
    this.registerService.inscriptionSubject.next(false)
    this.canvas = document.getElementById("solde_graph");
    this.incomes = this.incomeService.incomes;
    this.expenses = this.expenseService.expenses;
    this.incomeService.incomeSubject.subscribe(
      (data) => {this.incomes = data;  this.loadData();}
    );
    this.expenseService.expenseSubject.subscribe(
      (data) => {this.expenses = data;  this.loadData() }
    );

    this.authService.userSubject.subscribe(
      (data) => { this.currentUser = data;
        if(this.currentUser == null){
          this.getDataSets();
          this.loadChart()
        }
      }
    );

    if(typeof this.incomes !== 'undefined' && this.expenses !== 'undefined'  ){
      this.loadData();
    }
    this.ongletService.ongletSubject.next(false)
  }

 // **************************************************** METHODE *********************************************************

  loadData(){
    if(typeof this.myChartData !== 'undefined'){
      this.myChartData.destroy();
    }

    if(typeof this.incomes !== 'undefined' && typeof this.expenses !== 'undefined'){
      if(this.incomeService.getYears().length > this.expenseService.getYears().length){
        this.years = this.incomeService.getYears()
      }
      else {
        this.years = this.expenseService.getYears()
      }
      this.getDataSets();
      this.loadChart();
    }
  }

  getDataSets(){
    if(this.currentUser == null){
      if(typeof this.myChartData !== 'undefined'){
        this.myChartData.destroy();
      }
      return 0
    }
    const nbyears = this.years.length;
    const dataSets = [];
    const nbexpenseamount = this.expenses.length;
    const nbincomeamount = this.incomes.length;
    let actualsolde = 0
    let hidden = true

    for(let i = 0; i < nbyears; i++){
      let color;
      if(i == nbyears - 1){
        color = '#ffffff';
      }
      else {
        color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      }
      let expensesbymonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let incomesbymonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for(let j = 0; j < nbexpenseamount; j++){
        if(this.expenses[j].year == this.years[i]){
          const month = this.expenses[j].month
          expensesbymonth[month - 1] = this.expenses[j].amount
        }
      }

      for(let j = 0; j < nbincomeamount; j++){
        if(this.incomes[j].year == this.years[i]){
          const month = this.incomes[j].month
          incomesbymonth[month - 1] = this.incomes[j].amount
        }
      }

      for(let i =0;i<12;i++){
        incomesbymonth[i] = incomesbymonth[i] - expensesbymonth[i] + actualsolde
        actualsolde = Math.round((incomesbymonth[i]*100))/100
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
          data: incomesbymonth
        }
        dataSets.push(data)
    }
    return dataSets
  }

  loadChart(){
    this.ctx = this.canvas.getContext("2d")

    const month_labels = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"]
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
    }
    this.myChartData = new Chart(this.ctx, config)
  }
}
