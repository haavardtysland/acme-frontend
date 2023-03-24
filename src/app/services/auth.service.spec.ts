import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { Actor } from '../models/actor.model';

import { AuthService } from './auth.service';

fdescribe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('Should register a user', async () => {
    const actor: Actor = new Actor();
    actor.name = 'test';
    actor.surname = 'test';
    actor.email = 'my_gmail7@gmail.com';
    actor.password = '123456';

    const test = await service.registerUser(actor);
    expect(test).toBeTruthy();
  });

  it('Should login user', async () => {
    const actor: Actor = new Actor();
    actor.email = 'my_gmail7@gmail.com';
    actor.password = '123456';
    const response = await service.login(actor.email, actor.password);
    expect(response).toBeTruthy();
  });

  it('Should get 3 roles', async () => {
    expect(await service.getRoles().length).toEqual(3);
  });

  it('Should expect error on empty fields', async () => {
    const actor = new Actor();
    const response = await service.registerUser(actor);
    console.log(response);
    expect(response).toThrowError();
  });
});
