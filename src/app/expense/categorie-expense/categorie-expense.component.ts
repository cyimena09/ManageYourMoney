import { Component, OnInit } from '@angular/core';
import {ExpenseService} from '../../services/expense/expense.service';
import Chart from 'chart.js'
import 'chartjs-plugin-labels';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-categorie-expense',
  templateUrl: './categorie-expense.component.html',
  styleUrls: ['./categorie-expense.component.scss']
})
export class CategorieExpenseComponent implements OnInit {

 canvas;
  ctx;
  myChartData;
  categorie = [];
  dataForCategorie = [];

  test

  subscription: Subscription

  constructor(private expenseService: ExpenseService) {}

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
   // setTimeout(
    //  () => {this.getDataAndLabel(); this.loadChart();}
    //);
  }

  getDataAndLabel(){
    const dict = this.expenseService.getExpenseByCategorie()
    for (let key in dict ){
      this.categorie.push(key)
      this.dataForCategorie.push(dict[key])
    }
    return this.expenseService.getCategorieForChart();
  }

  getRandomColor(){
    // retourne un tableau de couleur pour les appliquer aux différentes catégorie
    const colorTable = []
    for (let i = 0; i< this.categorie.length; i++){
      const color = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
      colorTable.push(color)
    }
    return colorTable;
  }

  loadChart(){
    this.canvas = document.getElementById("categorieExpensePie")
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = '50px serif'
    this.ctx.fillText('coucou', 50,90)

    const config = {
      type: 'doughnut',
      data: {
        labels: this.categorie,
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
