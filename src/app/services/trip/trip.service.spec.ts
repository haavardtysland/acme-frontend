import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { AStatus } from 'src/app/enums/AStatus';
import { Application } from 'src/app/models/application.model';
import { Stage } from 'src/app/models/stage.model';
import { environment } from 'src/environments/environment';
import { Trip } from './../../models/trip.model';
import { TripService } from './trip.service';

fdescribe('TripService', () => {
  let service: TripService;
  let httpTestingController: HttpTestingController;
  let testStage: Stage = new Stage();
  let testTrip: Trip = new Trip();
  let testApplication: Application = new Application();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripService],
    });
    service = TestBed.inject(TripService);
    httpTestingController = TestBed.inject(HttpTestingController);

    //Initialize test Trip
    testStage.description = 'Stage description';
    testStage.price = 100;
    testStage.title = 'First Stage';

    testTrip.description = 'Jungle Party';
    testTrip.totalPrice = 1000;
    testTrip.startDate = '2023-07-01';
    testTrip.endDate = '2023-02-06';
    testTrip = new Trip();
    testTrip.description = 'Jungle party';
    testTrip.title = 'Test title';
    testTrip.requirements = ['testReq1', 'testReq2', 'testReq3'];
    testTrip.stages = [testStage];
    testTrip.totalPrice = 1000;
    testTrip.startDate = '2023-07-01';
    testTrip.endDate = '2023-07-06';
    testTrip._id = '645e6a10ea4c72e815eaede4';

    testApplication.dateCreated = new Date().toISOString().substring(0, 10);
    testApplication.comments = ['Allergic to gluten'];
    testApplication.explorerId = '523awe123asd121313';
    testApplication.status.status = AStatus.PENDING;
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unexpected requests were made
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create new trip', () => {
    let newTrip = new Trip();
    service.createTrip(testTrip).subscribe((trip) => {
      newTrip = trip;
    });
    const url = `${environment.backendApiBaseUrl}/Trips`;
    const request = httpTestingController.expectOne(url);
    request.flush(testTrip);

    expect(newTrip.title).toBe(testTrip.title);
    expect(newTrip.totalPrice).toBe(testTrip.totalPrice);
    expect(newTrip.description).toBe(testTrip.description);
    expect(newTrip.requirements).toBe(testTrip.requirements);
    expect(newTrip.stages).toBe(testTrip.stages);
    expect(newTrip.startDate).toBe(testTrip.startDate);
    expect(newTrip.endDate).toBe(testTrip.endDate);
  });

  it('should fail because end date before start date', () => {
    testTrip.endDate = '2023-02-06';
    let actualError: any;
    service.createTrip(testTrip).subscribe(
      (trip) => {
        fail('The request should have failed'); // Expecting the request to fail
      },
      (err) => {
        console.log('Request failed:', err); // Logging the error response
        actualError = err;
      }
    );

    const req = httpTestingController.expectOne(
      `${environment.backendApiBaseUrl}/Trips`
    );
    expect(req.request.method).toEqual('POST');

    // Simulate a failure response
    req.error(new ErrorEvent('UnproccesableEntity'), { status: 422 });

    //Check that the actual error response is of type HttpError
    expect(actualError instanceof HttpErrorResponse).toBe(true);
  });

  it('should apply for trip', () => {
    testTrip.endDate = '2023-07-06';
    let newTrip: any;
    testTrip.applications.push(testApplication);
    service
      .applyForTrip(testTrip._id, testApplication.comments)
      .subscribe((trip) => {
        newTrip = trip;
      });
    const req = httpTestingController.expectOne(
      `${environment.backendApiBaseUrl}/Trips/Applications`
    );
    req.flush(testTrip);

    expect(newTrip.applications[0].status.status).toBe(
      testApplication.status.status
    );
    expect(newTrip.applications[0].explorerId).toBe(testApplication.explorerId);
    expect(newTrip.applications[0].comments).toBe(testApplication.comments);
    expect(newTrip.applications[0].dateCreated).toBe(
      testApplication.dateCreated
    );
  });

  it('should fail application for trip', () => {
    let actualError: any;
    testTrip.startDate = '2023-05-11';
    service.applyForTrip(testTrip._id, testApplication.comments).subscribe(
      (trip) => {
        fail('The request should have failed'); // Expecting the request to fail
      },
      (err) => {
        console.log('Request failed:', err); // Logging the error response
        actualError = err;
      }
    );
    const req = httpTestingController.expectOne(
      `${environment.backendApiBaseUrl}/Trips/Applications`
    );
    expect(req.request.method).toEqual('POST');

    // Simulate a failure response
    req.error(new ErrorEvent('UnproccesableEntity'), { status: 422 });

    console.log(actualError);
    //Check that the actual error response is of type HttpError
    expect(actualError instanceof HttpErrorResponse).toBe(true);
  });
});
