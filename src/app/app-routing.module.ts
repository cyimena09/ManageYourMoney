import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './solde/solde.component';
import {TestComponent} from './test/test.component';
import {HistoriqueComponent} from './historique/historique.component';
import {ComparateurComponent} from './comparateur/comparateur.component';
import {LocalisationComponent} from './localisation/localisation.component';


const routes: Routes = [

  {path: 'managment', component: SoldeComponent},
  {path: 'comparator', component: ComparateurComponent},
  {path: 'historic', component: HistoriqueComponent},
  {path: 'test', component: TestComponent},
  {path: 'localisation', component: LocalisationComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
