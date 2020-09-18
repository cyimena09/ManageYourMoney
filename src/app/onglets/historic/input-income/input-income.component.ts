import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IncomeService} from '../../../services/income/income.service';

@Component({
  selector: 'app-input-income',
  templateUrl: './input-income.component.html',
  styleUrls: ['./input-income.component.scss']
})
export class InputIncomeComponent implements OnInit, OnDestroy {

  @Input() index;
  @Input() income;
  constructor(private incomeService: IncomeService) { }

  ngOnInit(): void {
  }

  onUpdateIncome(){
    return this.incomeService.updateIncome(this.income).subscribe();
  }

  onRemoveIncome(){
    return this.incomeService.removeIncome(this.income.incomeID).subscribe(
      () => {
        this.incomeService.incomesList = this.incomeService.incomesList.filter(income => income.incomeID != this.income.incomeID)
        this.incomeService.incomeListSubject.next(this.incomeService.incomesList)}
    );
  }

  ngOnDestroy(){
    this.onUpdateIncome();
  }
}
