import { Component, OnInit } from '@angular/core';
import {IncomeService} from '../services/income/income.service';
import {ExpenseService} from '../services/expense/expense.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
  styleUrls: ['./historic.component.scss']
})
export class HistoricComponent implements OnInit {

  expenses;
  incomes;
  expenseSubject = new Subject();
  incomeSubject = new Subject();
  constructor(private incomeService: IncomeService, private expenseService: ExpenseService) { }


  ngOnInit(): void {
    if(this.incomeService.currentUser != null && this.expenseService.currentUser != null){
      this.incomeService.getIncomesList().subscribe(
      (data) => {this.incomes = data;}
      );

      this.expenseService.getExpensesList().subscribe(
      (data) => {this.expenses = data;}
      );
    }

    this.expenseSubject.subscribe(
      (data) => {this.expenses = data}
    )
  }

  onRemoveExpense(expenseid){
    return this.expenseService.removeExpense(expenseid).subscribe(
      () => {
        this.expenses = this.expenses.filter(expense => expense.expenseID != expenseid )
        this.expenseSubject.next(this.expenses);
        this.expenseService.loadExpenses();
        },
      (error) => {console.log(error);}
      );

  }

  onRemoveIncome(incomeid) {
    return this.incomeService.removeIncome(incomeid).subscribe(
      () => {
        this.incomes = this.incomes.filter(income => income.incomeID != incomeid)
        this.incomeSubject.next(this.incomes);
        this.incomeService.loadIncomes();
        },
      (error) => {console.log(error)}
      );
  }

}
