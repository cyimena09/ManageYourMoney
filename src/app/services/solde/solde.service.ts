import { Injectable } from '@angular/core';
import {IncomeService} from '../income/income.service';
import {ExpenseService} from '../expense/expense.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoldeService {


  constructor(private incomeService: IncomeService, private expenseService: ExpenseService) { }



   getDataSoldeForChart(){
    const solde = [];
    let somme = 0;
    const incomeTable = this.incomeService.getDataIncomesForChart();
    const expenseTable = this.expenseService.getDataExpensesForChart();

    for (let i = 0; i < 12; i++){
      somme += (incomeTable[i] - expenseTable[i]);
      solde.push(somme);
    }
    return solde
  }
}
