import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { HeaderComponent } from './components/master/header/header.component';
import { HomeComponent } from './components/master/home/home.component';
import { MessageComponent } from './components/master/message/message.component';
import { ApplicationComponent } from './components/pages/application/application.component';
import { ApplicationsComponent } from './components/pages/applications/applications.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ManageAccountsComponent } from './components/pages/manage-accounts/manage-accounts.component';
import { ManageApplicationsComponent } from './components/pages/manage-applications/manage-applications.component';
import { ManageTripComponent } from './components/pages/manage-trip/manage-trip.component';
import { ManageTripsComponent } from './components/pages/manage-trips/manage-trips.component';
import { NewTripComponent } from './components/pages/new-trip/new-trip.component';
import { ProfileEditComponent } from './components/pages/profile-edit/profile-edit.component';
import { TripComponent } from './components/pages/trip/trip.component';
import { TripsComponent } from './components/pages/trips/trips.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { DeniedAccessComponent } from './shared/denied-access/denied-access.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { I18nModule } from './i18n.module';

export const firebaseConfig = {
  apiKey: 'AIzaSyBPT53ztR7ShpGyNDgQvnEgOGxxQkJ0Otc',
  authDomain: 'acme-auth.firebaseapp.com',
  projectId: 'acme-auth',
  storageBucket: 'acme-auth.appspot.com',
  messagingSenderId: '1064310712960',
  appId: '1:1064310712960:web:5896852b8c3cd263a2d465',
  measurementId: 'G-83Q5T96VWG',
};

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    NotFoundComponent,
    HomeComponent,
    FooterComponent,
    MessageComponent,
    DeniedAccessComponent,
    TripsComponent,
    ApplicationsComponent,
    ManageTripsComponent,
    ManageApplicationsComponent,
    ManageAccountsComponent,
    DashboardComponent,
    ProfileEditComponent,
    NewTripComponent,
    TripComponent,
    ManageTripComponent,
    ApplicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
  ],
  exports: [HeaderComponent],
  providers: [I18nModule.setLocale(), I18nModule.setLocaleId()],
  bootstrap: [AppComponent],
})
export class AppModule {}
