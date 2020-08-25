import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {SoldeService} from '../services/solde/solde.service';
import {IncomeService} from '../services/income/income.service';
import {ExpenseService} from '../services/expense/expense.service';


@Component({
  selector: 'app-solde',
  templateUrl: './solde.component.html',
  styleUrls: ['./solde.component.scss']
})
export class SoldeComponent implements OnInit {
  years;
  incomes
  expenses
  canvas;
  ctx;
  myChartData;

  constructor(private soldeService: SoldeService, private incomeService: IncomeService, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.incomes = this.incomeService.incomes;
    this.expenses = this.expenseService.expenses;
    this.incomeService.incomeSubject.subscribe(
      (data) => {this.incomes = data;  this.loadData();}
    );
    this.expenseService.expenseSubject.subscribe(
      (data) => {this.expenses = data;  this.loadData() }
    );
  }

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
    const nbyears = this.years.length;
    const dataSets = [];
    const nbexpenseamount = this.expenses.length;
    const nbincomeamount = this.incomes.length;
    let actualsolde = 0
    let hidden = true

    for(let i = 0; i < nbyears; i++){
      let expensesbymonth = [0,0,0,0,0,0,0,0,0,0,0,0];
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
        actualsolde = incomesbymonth[i]
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
          data: incomesbymonth
        }
        dataSets.push(data)
    }
    return dataSets
  }

  loadChart(){

    this.canvas = document.getElementById("solde_graph");
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
