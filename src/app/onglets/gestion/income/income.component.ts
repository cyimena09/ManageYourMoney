import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {NgForm} from '@angular/forms';
import {Income} from '../../../models/income';
import {UserService} from '../../../services/user/user.service';
import {IncomeService} from '../../../services/income/income.service';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  currentUser
  activated = true;
  incomes;
  years;
  categories: any = [];
  categoryName
  totalthismonth;
  totallastmonth
  difference
  total;
  dateDiff;
  average;
  actualDate = Date.now();
  lastDate = this.getLastMonth();
  newCategory: boolean;

  // graph parameter
  canvas:any;
  ctx;
  myChartLine;

  //check form
  invalid: boolean = false;

  constructor(private userService: UserService, private incomeService: IncomeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.canvas = document.getElementById("incomes_graph");
    this.incomes = this.incomeService.incomes;
    this.total = this.incomeService.total;
    this.average = this.incomeService.average;
    this.totalthismonth = this.incomeService.totalthismonth;
    this.totallastmonth = this.incomeService.totallastmonth;
    this.categories = this.incomeService.categories;
    this.difference = Math.round((((this.totalthismonth - this.totallastmonth) / this.totallastmonth) * 100)*100)/100 ;


    this.incomeService.incomeSubject.subscribe(
      (data) => {
        this.incomes = data;
        this.years = this.incomeService.getYears();
        this.getDataSets(); this.loadChart();
      });

    this.incomeService.totalSubject.subscribe(
      (data) => {
        this.total = data;
        if(typeof this.total !== 'undefined' && typeof this.dateDiff !== 'undefined'){
          this.average = Math.round((this.total / this.dateDiff)*100) /100 ;
        }
      });

    this.incomeService.dateDiffSubject.subscribe(
      (data) => {
        this.dateDiff = data;
        if(typeof this.total !== 'undefined' && typeof this.dateDiff !== 'undefined'){
          this.average = Math.round((this.total / this.dateDiff)*100) /100 ;
        }
      });

    this.incomeService.totalthismonthSubject.subscribe(
      (data) => {this.totalthismonth = data; this.difference =  this.getdifference();}
    );

     this.incomeService.totallastmonthSubject.subscribe(
      (data) => {this.totallastmonth = data; this.difference = this.getdifference();}
    );

    this.incomeService.categorySubject.subscribe(
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

    if(typeof this.incomes !== 'undefined'){
      this.years = this.incomeService.getYears();
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
        this.average = 0
        this.total = 0
        this.totalthismonth = 0
      }
      return 0
    }
    const nbyears = this.years.length
    const nbamount = this.incomes.length
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
    this.invalid = false;
    let amount = form.value['amount'];
    amount = Number(amount);


    if(isNaN(amount)){
      const focusamount = document.getElementById('amount-income')
      focusamount.style.border = 'red solid'
      return this.invalid = true
    }
    else{
      const newIncome = new Income();
      const category = form.value['category'];
      const date = form.value['date']

      if(this.newCategory){
        newIncome.category = this.categoryName;
      }
      else{
        if (category == ""){
          newIncome.category = "Autre";
          this.categories.push("Autre")
        }
        else{
          newIncome.category = category;
        }
      }
      newIncome.amount = amount;
      newIncome.date = new Date(date);
      newIncome.userID = Number(this.currentUser.UserID);
      this.incomeService.addIncome(newIncome);
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
