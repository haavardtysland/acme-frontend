import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { RegisterComponent } from './security/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/master/header/header.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { HomeComponent } from './components/master/home/home.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { MessageComponent } from './components/master/message/message.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
  ],
  exports: [HeaderComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
