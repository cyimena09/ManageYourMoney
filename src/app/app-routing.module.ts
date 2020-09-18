import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SoldeComponent} from './onglets/gestion/solde/solde.component';
import {HistoricComponent} from './onglets/historic/historic.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {UserSpaceComponent} from './user-space/user-space.component';
import {AdminSpaceComponent} from './admin-space/admin-space.component';
import {UsersListComponent} from './admin-space/users-list/users-list.component';
import {AdminGuardService} from './services/authguard/admin/admin-guard.service';
import {UserGuardService} from './services/authguard/user/user-guard.service';
import {DetailsComponent} from './onglets/details/details.component';
import {RegisterComponent} from './nav/register/register.component';
import {LoginComponent} from './nav/login/login.component';
import {UserDetailComponent} from './admin-space/users-list/user-detail/user-detail.component';



const routes: Routes = [

  {
    path: 'managment',
    component: SoldeComponent,
    children: [
      {path: 'register', component: RegisterComponent},
      {path: 'login', component: LoginComponent}
      ]
  },

  {path: 'details', component: DetailsComponent},

  {path: 'historic', component: HistoricComponent},
  {path: 'user-space', canActivate: [UserGuardService], component: UserSpaceComponent},
  {path: 'admin-space', canActivate: [AdminGuardService], component: AdminSpaceComponent},
  {
    path: 'users-list',
    canActivate: [AdminGuardService],
    component: UsersListComponent,
    children: [
      {path: 'user-detail/:id', component: UserDetailComponent}
      ]
  },

  {path: 'not_found', component: NotFoundComponent},
  {path: '', redirectTo: 'managment', pathMatch: 'full'},
  {path: '**', redirectTo: 'not_found'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
