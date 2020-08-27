import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {NgForm} from '@angular/forms';
import {Income} from '../models/income';
import {UserService} from '../services/user/user.service';
import {IncomeService} from '../services/income/income.service';
import {AuthService} from '../services/auth/auth.service';

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
  totalthismonth;
  total;
  dateDiff;
  average;
  actualDate = Date.now();
  newCategorie: boolean;

  // graph parameter
  canvas:any;
  ctx;
  myChartLine;

  constructor(private userService: UserService, private incomeService: IncomeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.canvas = document.getElementById("incomes_graph");
    this.incomes = this.incomeService.incomes;
    this.total = this.incomeService.total;
    this.average = this.incomeService.average;
    this.totalthismonth = this.incomeService.totalthismonth;

    this.incomeService.incomeSubject.subscribe(
      (data) => {this.incomes = data; this.years = this.incomeService.getYears(); this.getDataSets(); this.loadChart();}
    );

    if(this.currentUser != null){
      this.incomeService.getCategories().subscribe(
      (data) => {this.categories = data;}
    );
    }


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
      (data) => this.totalthismonth = data
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

  onActivated(){
    if(this.activated){
      document.getElementById('incomes_graph').style.display = 'none';
    }
    else {
      document.getElementById('incomes_graph').style.display = 'block';
    }
    this.activated = !this.activated
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
    newIncome.userID = Number(this.currentUser.UserID);
    this.incomeService.addIncome(newIncome);
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
