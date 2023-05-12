import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';
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
import { NewTripComponent } from './new-trip.component';

fdescribe('Display trip', () => {
  let component: NewTripComponent;
  let fixture: ComponentFixture<NewTripComponent>;
  let mockActivatedRoute: ActivatedRouteStub;
  let testTrip: Trip;
  let testStage: Stage;
  let getTripSpy: any;

  beforeEach(async () => {
    mockActivatedRoute = new ActivatedRouteStub();
    mockActivatedRoute.testParams = { id: '642329a6cd6b90b38d07a0aa' };

    testStage = new Stage();
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
      declarations: [NewTripComponent],
      imports: [
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(NewTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Trip', () => {
    expect(component).toBeTruthy();
  });
  it('should create new trip', () => {
    component.tripForm.controls['title'].setValue('Test1');
    component.tripForm.controls['description'].setValue('Jungle party');
    component.tripForm.controls['requirement'].setValue('Requirements');
    component.tripForm.controls['startDate'].setValue('2023-07-01');
    component.tripForm.controls['endDate'].setValue('2023-07-06');
    component.stageForm.controls['title'].setValue('Jungle stage 1');
    component.stageForm.controls['description'].setValue('Test Description');
    component.stageForm.controls['price'].setValue(0);
    component.stages.push(testStage);
    fixture.detectChanges();
    let button = fixture.nativeElement.querySelector('#createButton');
    expect(button.disabled).toBeFalse();
  });

  it('should not create new trip because of disabled button', () => {
    component.tripForm.controls['title'].setValue('Test1');
    component.tripForm.controls['description'].setValue('Jungle party');
    component.tripForm.controls['requirement'].setValue('Requirements');
    component.tripForm.controls['startDate'].setValue('2023-07-01');
    component.tripForm.controls['endDate'].setValue('2023-02-06');
    fixture.detectChanges();
    let button = fixture.nativeElement.querySelector('#createButton');
    let div = fixture.nativeElement.querySelector('#endDateAfterStartDate');
    expect(button.disabled).toBeTrue();
    expect(div.textContent).toBe(' end-date-after-start-date '); //translate key
  });
});
