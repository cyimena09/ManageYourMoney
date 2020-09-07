import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js'
import {IncomeService} from '../../services/income/income.service';

@Component({
  selector: 'app-categorie-income',
  templateUrl: './categorie-income.component.html',
  styleUrls: ['./categorie-income.component.scss']
})
export class CategorieIncomeComponent implements OnInit {
  incomes
  categories = []
  dataForCategory = [];

  canvas
  ctx
  myChartData


  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.incomeService.getIncomesByCategory().subscribe(
      (data) => {this.incomes = data; this.getCategory(); this.getDataForCategory(); this.loadChart()}
    );
  }

  getCategory(){
    const nbcat = this.incomes.length;
    for(let i = 0; i < nbcat; i++){
      this.categories.push(this.incomes[i].category)
    }
  }

  getDataForCategory(){
    const nbcat = this.incomes.length;
    for(let i = 0; i < nbcat; i++){
      this.dataForCategory.push(this.incomes[i].amount)
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
    this.canvas = document.getElementById("categoryIncomePie")
    this.ctx = this.canvas.getContext("2d");

    const config = {
      type: 'doughnut',
      data: {
        labels: this.categories,
        datasets : [{
          data: this.dataForCategory,
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
