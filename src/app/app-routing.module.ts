import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './solde/solde.component';
import {HistoricComponent} from './historic/historic.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RegisterComponent} from './register/register.component';


const routes: Routes = [

  {path: 'managment', component: SoldeComponent},
  {path: 'historic', component: HistoricComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'not_found', component: NotFoundComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'},
  {path: '**', redirectTo: 'not_found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
