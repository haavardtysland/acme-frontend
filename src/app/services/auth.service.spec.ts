import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { Actor } from '../models/actor.model';

import { AuthService } from './auth.service';

describe('AuthService', () => {
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

  it('Should register a user', (done) => {
    const actor: Actor = new Actor();
    actor.name = 'test';
    actor.surname = 'test';
    actor.email = 'test@gmail.com';
    actor.password = '123456';

    //If test is run once previosuly, then this will fail as user is in database. We are currently using our deployed backend which can be seen in the environment files.
    service.registerUser(actor).subscribe((res) => {
      expect(res['name']).toEqual(actor.name);
      expect(res['surname']).toEqual(actor.surname);
      expect(res['email']).toEqual(actor.email);
      done();
    });
  });

  /*
  For some reason mongodb duplicate does not always work for our backend so this test is unstable. Somtehing to look at backend.
  it('Should not re-register the user', (done) => {
    const actor: Actor = new Actor();
    actor.name = 'test';
    actor.surname = 'test';
    actor.email = 'test7@gmail.com';
    actor.password = '123456';

    service.registerUser(actor).subscribe((res) => {
      expect(res.error).toContain('duplicate key');
      done();
    });
  }); */

  //Not sure why this and next gives warning spec has no expectations
  it('Should login user', (done) => {
    const actor: Actor = new Actor();
    actor.email = 'test@gmail.com';
    actor.password = '123456';
    service.login(actor.email, actor.password).subscribe((res) => {
      expect(res['id'] && res['balle']).toBeTruthy;
      done();
    });
  });

  it('Should login with wrong password', (done) => {
    const actor: Actor = new Actor();
    actor.email = 'test@gmail.com';
    actor.password = '654321';
    service.login(actor.email, actor.password).subscribe((res) => {
      expect(res['id'] && res['balle']).toBeTruthy;
      done();
    });
  });

  it('Should fail login with unkown email', (done) => {
    const actor: Actor = new Actor();
    actor.email = 'not_a_real_user@usergmail.com';
    actor.password = '12345';
    service.login(actor.email, actor.password).subscribe((res) => {
      console.log(res.error);
      expect(res.error).toEqual(
        'Could not find actor with email ' + actor.email + ' '
      );
      done();
    });
  });

  it('Should get 3 roles', async () => {
    const length = await service.getRoles().length;
    expect(length).toEqual(3);
  });

  it('Should expect error on empty fields', (done) => {
    const actor = new Actor();
    service.registerUser(actor).subscribe((res) => {
      expect(res.error[0].message).toEqual('must match format "email"');
      done();
    });
  });
});
