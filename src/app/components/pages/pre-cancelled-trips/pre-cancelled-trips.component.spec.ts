import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCancelledTripsComponent } from './pre-cancelled-trips.component';

describe('PreCancelledTripsComponent', () => {
  let component: PreCancelledTripsComponent;
  let fixture: ComponentFixture<PreCancelledTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreCancelledTripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreCancelledTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
