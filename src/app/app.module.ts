import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {LOCALE_ID, NgModule} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpenseComponent } from './onglets/gestion/expense/expense.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IncomeComponent} from './onglets/gestion/income/income.component';
import { SoldeComponent } from './onglets/gestion/solde/solde.component';
import { CategorieIncomeComponent } from './onglets/details/categorie-income/categorie-income.component';
import { CategorieExpenseComponent } from './onglets/details/categorie-expense/categorie-expense.component';
import { HistoricComponent } from './onglets/historic/historic.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NavComponent } from './nav/nav.component';
import { OngletComponent } from './onglets/onglet.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSpaceComponent } from './user-space/user-space.component';
import { AdminSpaceComponent } from './admin-space/admin-space.component';
import { UsersListComponent } from './admin-space/users-list/users-list.component';
import { InputExpenseComponent } from './onglets/historic/input-expense/input-expense.component';
import { InputIncomeComponent } from './onglets/historic/input-income/input-income.component';
import { DetailsComponent } from './onglets/details/details.component';
import {LoginComponent} from './nav/login/login.component';
import {RegisterComponent} from './nav/register/register.component';
import { UserDetailComponent } from './admin-space/users-list/user-detail/user-detail.component';


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
    UserSpaceComponent,
    AdminSpaceComponent,
    UsersListComponent,
    InputExpenseComponent,
    InputIncomeComponent,
    DetailsComponent,
    UserDetailComponent,
  ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      NgbModule,
      ReactiveFormsModule
    ],
  providers: [{ provide: LOCALE_ID, useValue: "fr-Fr" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
