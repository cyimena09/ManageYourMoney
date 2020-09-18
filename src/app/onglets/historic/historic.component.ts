import { Component, OnInit } from '@angular/core';
import {IncomeService} from '../../services/income/income.service';
import {ExpenseService} from '../../services/expense/expense.service';
import {fadeInAnimation} from '../../models/animations/fadeAnimation';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class HistoricComponent implements OnInit {

  expenses;
  incomes;

  constructor(private incomeService: IncomeService, private expenseService: ExpenseService, ) { }

  ngOnInit(): void {
    if(this.incomeService.currentUser != null && this.expenseService.currentUser != null){
      this.incomes = this.incomeService.incomesList
      this.incomeService.incomeListSubject.subscribe(
        (data) => {this.incomes = data}
      );

      this.expenses =  this.expenseService.expensesList;
      this.expenseService.expenseListSubject.subscribe(
        (data) => {this.expenses = data}
      );
    }
  }

}

