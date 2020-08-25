import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieExpenseComponent } from './categorie-expense.component';

describe('CategorieExpenseComponent', () => {
  let component: CategorieExpenseComponent;
  let fixture: ComponentFixture<CategorieExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
