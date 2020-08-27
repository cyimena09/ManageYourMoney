import { BrowserModule } from '@angular/platform-browser';

import {LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpenseComponent } from './expense/expense.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {IncomeComponent} from './income/income.component';
import { SoldeComponent } from './solde/solde.component';
import { CategorieIncomeComponent } from './income/categorie-income/categorie-income.component';
import { CategorieExpenseComponent } from './expense/categorie-expense/categorie-expense.component';
import { HistoricComponent } from './historic/historic.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OngletComponent } from './onglet/onglet.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseComponent,
    IncomeComponent,
    SoldeComponent,
    CategorieIncomeComponent,
    CategorieExpenseComponent,
    HistoricComponent,
    NotFoundComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    OngletComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "fr-Fr" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
