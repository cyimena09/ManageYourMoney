import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import Chart from 'chart.js';
import {NgForm} from '@angular/forms';
import {Income} from '../models/income';
import {UserService} from '../services/user/user.service';
import {IncomeService} from '../services/income/income.service';
import {Expense} from '../models/expense';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

  incomes
  years
  categories
  //instancier income dans le component pour ne pas sy souscrire 10fois

  @Output() updateSolde = new EventEmitter();

  actualDate = Date.now();
  totalIncomes: number;
  incomesByDay;
  incomesThisMonth;
  incomesLastMont;
  averageByMonth;
  averageDiff;
  absAverageDiff;
  categorie;
  newCategorie: boolean;
  dataIncomesForChart: any = [];

  // graph parameter
  canvas:any;
  ctx;
  myChartLine;

  constructor(private userService: UserService, private incomeService: IncomeService) { }

  ngOnInit(): void {
    this.incomes = this.incomeService.incomes;
    this.incomeService.incomeSubject.subscribe(
      (data) => {this.incomes = data; this.years = this.incomeService.getYears(); this.getDataSets(); this.loadChart();}
    );

    this.incomeService.getCategories().subscribe(
      (data) => {this.categories = data;}
    );
  }

  getDataSets(){
    const nbyears = this.years.length
    const nbamount = this.incomes.length
    const dataSets = []
    let hidden = true

    for(let i = 0; i < nbyears; i++){
      let amountbymonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for(let j = 0; j< nbamount; j++){
        if(this.incomes[j].year == this.years[i]){
          const month = this.incomes[j].month
          amountbymonth[month - 1] = this.incomes[j].amount
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

  loadIncomes(){
    this.loadChart();
  }

  getAverageForChart(){
    const table = [];
    let average =  this.incomeService.getAverageByMonth();
    average = Math.round(average*100)/100

    for (let i = 0; i<12;i++){
      table.push(average)
    }
    return table
  }

  loadChart(){
    this.canvas = document.getElementById("incomes_graph");
    this.ctx = this.canvas.getContext("2d")

    const month_labels = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOUT', 'SEP', 'OCT', 'NOV', 'DEC'];

    const config = {
      type: 'line',
      data: {
        labels: month_labels,
        datasets: this.getDataSets()
          // {
          //   hidden: true,
          //   label: 'Moyenne',
          //   fill: false,
          //   borderColor: '#265212',
          //   borderWidth: 2,
          //   data: [0,0,0,0,0,0,0,0,0,0,0,0]
          // }]
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
    this.myChartLine = new Chart(this.ctx, config)
  }

  onAddIncome(form: NgForm){
    let amount = form.value['amount'];
    amount = Number(amount)
    const categorie = form.value['categorie'];
    const date = form.value['date']
    const newIncome = new Income();
    newIncome.amount = amount;

    if (categorie == ""){
      newIncome.categorie = "Autre";
      this.categories.push("Autre")
    }
    else{
      newIncome.categorie = categorie;
    }

    newIncome.date = new Date(date);
    newIncome.userID = 1
    this.myChartLine.destroy();
    this.incomeService.addIncome(newIncome);
  }

  onAddCategorie(){
    this.newCategorie = !this.newCategorie;
  }

  onSaveCategorie(form: NgForm){
    const newCat = form.value['categorie'];
    this.userService.user.incomeCategories.push(newCat);
    this.userService.saveUser(this.userService.user);
    form.reset();
  }

}
