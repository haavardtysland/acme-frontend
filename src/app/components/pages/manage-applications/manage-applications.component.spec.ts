import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageApplicationsComponent } from './manage-applications.component';
import { TripService } from 'src/app/services/trip/trip.service';
import { Trip } from 'src/app/models/trip.model';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/app/shared/activated-route-stub/activated-route-stub';
import { of } from 'rxjs';
import { Stage } from 'src/app/models/stage.model';
import { Application } from 'src/app/models/application.model';
import { AStatus } from 'src/app/enums/AStatus';
import { ApplicationStatus } from 'src/app/models/application-status.model';
import { AuthService } from 'src/app/services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { Role } from 'src/app/enums/RoleEnum';

fdescribe('Display applications', () => {
  let component: ManageApplicationsComponent;
  let fixture: ComponentFixture<ManageApplicationsComponent>;
  let mockActivatedRoute: ActivatedRouteStub;
  let testTrip: Trip;
  let testTrip2: Trip;
  let getTripsSpy: any;
  let trips: Trip[];
  let actor: Actor;

  beforeEach(async () => {
    mockActivatedRoute = new ActivatedRouteStub();
    mockActivatedRoute.testParams = { id: '642329a6cd6b90b38d07a0aa' };

    const application: Application = new Application();
    application.comments = ['hey'];
    application.dateCreated = '2023-04-14';
    application.explorerId = '123';
    application.status = new ApplicationStatus();

    const application2: Application = new Application();
    application2.comments = ['hey'];
    application2.dateCreated = '2023-04-14';
    application2.explorerId = '1233';
    application2.status = new ApplicationStatus();

    testTrip = new Trip();
    testTrip.description = 'Jungle party';
    testTrip.title = 'Test title';
    testTrip.requirements = ['testReq1', 'testReq2', 'testReq3'];
    testTrip.totalPrice = 1000;
    testTrip.startDate = '2023-07-01';
    testTrip.endDate = '2023-07-06';
    testTrip.applications = [application, application2];

    testTrip2 = new Trip();
    testTrip2.description = 'Jungle party';
    testTrip2.title = 'Test title';
    testTrip2.requirements = ['testReq1', 'testReq2', 'testReq3'];
    testTrip2.totalPrice = 1000;
    testTrip2.startDate = '2023-07-01';
    testTrip2.endDate = '2023-07-06';

    trips = [testTrip, testTrip2];

    actor = new Actor();
    actor.role = Role.MANAGER;
    actor._id = '123';
    actor.name = 'test';
    actor.surname = 'test';
    actor.address = 'aaa';
    actor.email = '1@1.com';
    actor.password = '123455676';
    actor.phone = '123123';
    let tripSpy = jasmine.createSpyObj('TripService', ['getTripByManagerId']);
    getTripsSpy = tripSpy.getTripByManagerId.and.returnValue(of(trips));

    const getCurrentActorSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentActor',
    ]);
    getCurrentActorSpy.getCurrentActor.and.returnValue(of(actor));

    await TestBed.configureTestingModule({
      declarations: [ManageApplicationsComponent],
      imports: [],
      providers: [
        { provide: AuthService, useValue: getCurrentActorSpy },
        { provide: TripService, useValue: tripSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 2 applications', () => {
    const tripWithApplications = component.trips.find(
      (trip) => trip.applications.length > 0
    );
    expect(tripWithApplications).toBeDefined();
    expect(tripWithApplications?.applications.length).toBe(2);
  });

  it('should display 0 applications', () => {
    const tripWithoutApplications = component.trips.find(
      (trip) => trip.applications.length === 0
    );
    expect(tripWithoutApplications).toBeDefined();
    expect(tripWithoutApplications?.applications.length).toBe(0);
  });
});
