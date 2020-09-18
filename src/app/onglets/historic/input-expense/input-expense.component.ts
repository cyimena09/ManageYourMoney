import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ExpenseService} from '../../../services/expense/expense.service';

@Component({
  selector: 'app-input-expense',
  templateUrl: './input-expense.component.html',
  styleUrls: ['./input-expense.component.scss']
})
export class InputExpenseComponent implements OnInit, OnDestroy {

  @Input() index;
  @Input() expense;
  constructor(private expenseService: ExpenseService) { }

  ngOnInit(): void {
  }

  onUpdateExpense(){
    return this.expenseService.updateExpense(this.expense).subscribe();
  }

  onRemoveExpense(){
    return this.expenseService.removeExpense(this.expense.expenseID).subscribe(
      () => {
        this.expenseService.expensesList = this.expenseService.expensesList.filter(expense => expense.expenseID != this.expense.expenseID)
        this.expenseService.expenseListSubject.next(this.expenseService.expensesList)}
    );
  }

  ngOnDestroy(){
    this.onUpdateExpense();
  }
}
