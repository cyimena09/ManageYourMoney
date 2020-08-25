import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './solde/solde.component';
import {HistoriqueComponent} from './historique/historique.component';


const routes: Routes = [

  {path: 'managment', component: SoldeComponent},
  {path: 'historic', component: HistoriqueComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
