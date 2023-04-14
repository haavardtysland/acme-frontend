import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/master/home/home.component';
import { ApplicationComponent } from './components/pages/application/application.component';
import { ApplicationsComponent } from './components/pages/applications/applications.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ManageAccountsComponent } from './components/pages/manage-accounts/manage-accounts.component';
import { ManageApplicationsComponent } from './components/pages/manage-applications/manage-applications.component';
import { ManageTripsComponent } from './components/pages/manage-trips/manage-trips.component';
import { ProfileEditComponent } from './components/pages/profile-edit/profile-edit.component';
import { TripComponent } from './components/pages/trip/trip.component';
import { TripsComponent } from './components/pages/trips/trips.component';
import { Role } from './enums/RoleEnum';
import { ActorRoleGuard } from './guards/actor-role.guard';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { DeniedAccessComponent } from './shared/denied-access/denied-access.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileEditComponent,
    canActivate: [ActorRoleGuard],
    data: { expectedRole: [Role.EXPLORER, Role.MANAGER, Role.ADMINISTRATOR] },
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [ActorRoleGuard],
    data: { expectedRole: [Role.EXPLORER, Role.ADMINISTRATOR, Role.MANAGER] },
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'trips',
    children: [
      { path: '', component: TripsComponent },
      { path: ':id', component: TripComponent },
    ],
  },
  {
    path: 'applications',
    canActivate: [ActorRoleGuard],
    data: { expectedRole: [Role.EXPLORER] },
    children: [
      { path: '', component: ApplicationsComponent },
      { path: ':id', component: ApplicationComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ActorRoleGuard],
    data: { expectedRole: [Role.ADMINISTRATOR] },
  },
  {
    path: 'manage-accounts',
    component: ManageAccountsComponent,
    canActivate: [ActorRoleGuard],
    data: { expectedRole: Role.ADMINISTRATOR },
  },
  {
    path: 'trips/manage',
    children: [
      { path: ':id', component: ManageTripsComponent },
      { path: 'new', component: ManageTripsComponent },
    ],
    canActivate: [ActorRoleGuard],
    data: { expectedRole: Role.MANAGER },
  },
  {
    path: 'applications/manage/:id',
    component: ManageApplicationsComponent,
    canActivate: [ActorRoleGuard],
    data: { expectedRole: Role.MANAGER },
  },
  { path: 'denied-access', component: DeniedAccessComponent },
  { path: '', redirectTo: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
