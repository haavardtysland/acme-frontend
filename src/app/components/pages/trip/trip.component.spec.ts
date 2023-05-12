import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip/trip.service';
import { ActivatedRouteStub } from 'src/app/shared/activated-route-stub/activated-route-stub';
import { environment } from 'src/environments/environment';
import { TripComponent } from './trip.component';

fdescribe('Display trip', () => {
  let component: TripComponent;
  let fixture: ComponentFixture<TripComponent>;
  let mockActivatedRoute: ActivatedRouteStub;
  let testTrip: Trip;
  let getTripSpy: any;

  beforeEach(async () => {
    mockActivatedRoute = new ActivatedRouteStub();
    mockActivatedRoute.testParams = { id: '642329a6cd6b90b38d07a0aa' };

    const testStage = new Stage();
    testStage.description = 'Stage description';
    testStage.price = 100;
    testStage.title = 'First Stage';

    testTrip = new Trip();
    testTrip.description = 'Jungle party';
    testTrip.title = 'Test title';
    testTrip.requirements = ['testReq1', 'testReq2', 'testReq3'];
    testTrip.stages = [testStage];
    testTrip.totalPrice = 1000;
    testTrip.startDate = '2023-07-01'; /* Date.now().toString(); */
    testTrip.endDate = '2023-07-06'; /* Date.now().toString(); */

    let tripSpy = jasmine.createSpyObj('TripService', ['getTripById']);
    getTripSpy = tripSpy.getTripById.and.returnValue(of(testTrip));

    await TestBed.configureTestingModule({
      declarations: [TripComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        { provide: TripService, useValue: tripSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'angularfire2.app.options', useValue: {} },
        AngularFireAuth,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Trip', () => {
    expect(component).toBeTruthy();
  });

  it('should not create Trip', () => {
    testTrip.totalPrice = 1001;
    testTrip.startDate = '2023-07-01'; /* Date.now().toString(); */
    testTrip.endDate = '2023-02-06'; /* Date.now().toString(); */

    let tripSpy = jasmine.createSpyObj('TripService', ['getTripById']);
    getTripSpy = tripSpy.getTripById.and.returnValue(of(testTrip));
    fixture.detectChanges();
    expect(component.trip.totalPrice).toBe(1001);
  });

  it('should have correct id', () => {
    expect(component.id).toBe('642329a6cd6b90b38d07a0aa');
  });
  it('should not be undefined', () => {
    expect(component.trip).not.toBeUndefined();
  });
  it('should have correct totalprice', () => {
    fixture.detectChanges();
    expect(component.trip.totalPrice).toBe(testTrip.totalPrice);
  });
  it('should have the correct requirements', () => {
    fixture.detectChanges();
    expect(component.trip.requirements).toBe(testTrip.requirements);
  });
  it('should have the correct description', () => {
    fixture.detectChanges();
    expect(component.trip.description).toBe(testTrip.description);
  });
  it('should display correct title', () => {
    let titleDiv = fixture.nativeElement.querySelector('h5.card-title');
    fixture.detectChanges();
    expect(titleDiv.textContent).toContain(component.trip.title);
  });
  it('should display correct description', () => {
    let descriptionP = fixture.nativeElement.querySelector('#desc');
    fixture.detectChanges();
    expect(descriptionP.textContent).toContain(component.trip.description);
  });
  it('should display only one stage card', () => {
    let stageDiv = fixture.nativeElement.querySelector('#accordionExample');
    fixture.detectChanges();
    expect(stageDiv.children.length).toBe(1);
  });
});
