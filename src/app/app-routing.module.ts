import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/master/home/home.component';
import { ApplicationComponent } from './components/pages/application/application.component';
import { ApplicationsComponent } from './components/pages/applications/applications.component';
import { ManageAccountsComponent } from './components/pages/manage-accounts/manage-accounts.component';
import { ManageApplicationsComponent } from './components/pages/manage-applications/manage-applications.component';
import { ManageTripsComponent } from './components/pages/manage-trips/manage-trips.component';
import { NewTripComponent } from './components/pages/new-trip/new-trip.component';
import { ProfileEditComponent } from './components/pages/profile-edit/profile-edit.component';
import { TripComponent } from './components/pages/trip/trip.component';
import { TripsComponent } from './components/pages/trips/trips.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { DeniedAccessComponent } from './shared/denied-access/denied-access.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:id', component: ProfileEditComponent },
  {
    path: 'trips',
    children: [
      { path: '', component: TripsComponent },
      { path: ':Id', component: TripComponent },
    ],
  },
  { path: 'applications', children:[
    { path: '', component: ApplicationsComponent },
    { path: ':Id', component: ApplicationComponent }
  ] },
  { path: 'dashboard', component: RegisterComponent,canActivate:[ActorRoleGuard],data:[expextedRole:"ADMINISTRATOR"] },
  { path: 'manage-accounts', component: ManageAccountsComponent,canActivate:[ActorRoleGuard],data:[expextedRole:"ADMINISTRATOR"] },
  { path: 'manage-trips', children: [{ path: ':Id', component: ManageTripsComponent },{ path: 'new', component: ManageTripsComponent }],canActivate:[ActorRoleGuard],data:[expextedRole:"MANAGER"] },
  { path: 'manage-applications', component: ManageApplicationsComponent ,canActivate:[ActorRoleGuard],data:[expextedRole:"MANAGER"]},
  { path: 'denied-acess', component: DeniedAccessComponent },
  { path: '', redirectTo: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
