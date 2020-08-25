import { Component, OnInit } from '@angular/core';
import {ExpenseService} from '../../services/expense/expense.service';
import Chart from 'chart.js'
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-categorie-expense',
  templateUrl: './categorie-expense.component.html',
  styleUrls: ['./categorie-expense.component.scss']
})
export class CategorieExpenseComponent implements OnInit {
  expenses;
  categories = [];
  dataForCategorie = [];

  canvas;
  ctx;
  myChartData;


  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.getExpensesByCategorie().subscribe(
      (data) => {this.expenses = data; this.getCategorie(); this.getDataForCategorie(); this.loadChart()}
    );
  }

  getCategorie(){
    const nbcat = this.expenses.length;
    for(let i = 0; i < nbcat; i++){
      this.categories.push(this.expenses[i].categorie)
    }
  }

  getDataForCategorie(){
    const nbcat = this.expenses.length;
    for(let i = 0; i < nbcat; i++){
      this.dataForCategorie.push(this.expenses[i].amount)
    }
  }

  getRandomColor(){
    // retourne un tableau de couleur pour les appliquer aux différentes catégorie
    const colorTable = []
    for (let i = 0; i< this.categories.length; i++){
      const color = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
      colorTable.push(color)
    }
    return colorTable;
  }

  loadChart(){
    this.canvas = document.getElementById("categorieExpensePie")
    this.ctx = this.canvas.getContext("2d");

    const config = {
      type: 'doughnut',
      data: {
        labels: this.categories,
        datasets : [{
          data: this.dataForCategorie,
          backgroundColor: this.getRandomColor()
        }]
      },
      options: {
        legend: {
          position: 'left',
          labels: {
            fontColor: 'white',
            fontsize: '25px',
          }
        },
        plugins: {
          labels : {
            precision: 1,
            fontSize: 12,
            fontColor: 'white',
          }
        },
      }
    }
    this.myChartData = new Chart(this.ctx, config)
  }
}
