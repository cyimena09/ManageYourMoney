import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './solde/solde.component';
import {HistoricComponent} from './historic/historic.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RegisterComponent} from './register/register.component';
import {UserSpaceComponent} from './user-space/user-space.component';
import {AdminSpaceComponent} from './admin-space/admin-space.component';
import {UsersListComponent} from './users-list/users-list.component';
import {AdminGuardService} from './services/authguard/admin/admin-guard.service';
import {UserGuardService} from './services/authguard/user/user-guard.service';


const routes: Routes = [

  {path: '', component: SoldeComponent},
  {path: 'managment', component: SoldeComponent},
  {path: 'historic', component: HistoricComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-space', canActivate: [UserGuardService], component: UserSpaceComponent},
  {path: 'admin-space', canActivate: [AdminGuardService], component: AdminSpaceComponent},
  {path: 'users-list', canActivate: [AdminGuardService], component: UsersListComponent},
  {path: 'not_found', component: NotFoundComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'},
  {path: '**', redirectTo: 'not_found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
