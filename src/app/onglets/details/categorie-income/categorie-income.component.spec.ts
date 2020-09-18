import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieIncomeComponent } from './categorie-income.component';

describe('CategorieIncomeComponent', () => {
  let component: CategorieIncomeComponent;
  let fixture: ComponentFixture<CategorieIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
