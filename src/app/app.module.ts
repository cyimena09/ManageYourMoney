import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpenseComponent } from './expense/expense.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {IncomeComponent} from './income/income.component';
import { SoldeComponent } from './solde/solde.component';
import { CategorieIncomeComponent } from './income/categorie-income/categorie-income.component';
import { CategorieExpenseComponent } from './expense/categorie-expense/categorie-expense.component';
import { TestComponent } from './test/test.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ComparateurComponent } from './comparateur/comparateur.component';
import { LocalisationComponent } from './localisation/localisation.component';
import {GoogleMapsModule} from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    IncomeComponent,
    SoldeComponent,
    CategorieIncomeComponent,
    CategorieExpenseComponent,
    TestComponent,
    HistoriqueComponent,
    ComparateurComponent,
    LocalisationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
