import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputExpenseComponent } from './input-expense.component';

describe('InputExpenseComponent', () => {
  let component: InputExpenseComponent;
  let fixture: ComponentFixture<InputExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
