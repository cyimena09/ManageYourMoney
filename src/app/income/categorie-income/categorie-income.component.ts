import {Component, Input, OnInit, Output} from '@angular/core';
import Chart from 'chart.js'
import {IncomeService} from '../../services/income/income.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-categorie-income',
  templateUrl: './categorie-income.component.html',
  styleUrls: ['./categorie-income.component.scss']
})
export class CategorieIncomeComponent implements OnInit {
  canvas
  ctx
  myChartData
  categorie = []
  dataForCategorie = []
  mess

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    //setTimeout(
     // () => {this.getDataAndLabel(); this.loadChart();}
   // );
  }

  getDataAndLabel(){
    const dict = this.incomeService.getIncomesByCategorie()
    for (let key in dict ){
      this.categorie.push(key)
      this.dataForCategorie.push(dict[key])
    }
    return this.incomeService.getCategorieForChart();
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
    this.canvas = document.getElementById("categorieIncomePie")
    this.ctx = this.canvas.getContext("2d");
    const config = {
      type: 'pie',
      data: {
        labels: this.categorie,
        datasets : [{
          data: this.dataForCategorie,
          backgroundColor: this.getRandomColor()
        }]
      },
      options: {layout: {padding:{left:0,right:0}}}
    }
    this.myChartData = new Chart(this.ctx, config)
  }
}
