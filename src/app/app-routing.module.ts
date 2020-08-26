import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './solde/solde.component';
import {HistoricComponent} from './historic/historic.component';


const routes: Routes = [

  {path: 'managment', component: SoldeComponent},
  {path: 'historic', component: HistoricComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
