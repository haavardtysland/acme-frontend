import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip/trip.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FinderService } from 'src/app/services/finder/finder.service';
import { Actor } from 'src/app/models/actor.model';
import { Finder } from 'src/app/models/finder.model';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
})
export class TripsComponent implements OnInit {
  finderForm: FormGroup;
  trips: Trip[];

  constructor(
    private tripService: TripService,
    private finderService: FinderService, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
    this.trips = [];
    this.finderForm = this.fb.group({
      keyWord: [null],
      fromDate: [null],
      toDate: [null],
      fromPrice: [null],
      toPrice: [null],
    });
  }

  ngOnInit(): void {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.trips = trips;
      console.log('Display trip: ' + trips);
    });
    const currentActor = this.authService.getCurrentActor();
    if (currentActor) {
      this.finderService
        .getFinder(currentActor._id)
        .subscribe((actor: Actor) => {
          const finder: Finder = actor.finder;
          if (finder.fromDate != null) {
            finder.fromDate = finder.fromDate.substring(0, 10);
          }
          if (finder.toDate != null) {
            finder.toDate = finder.toDate.substring(0, 10);
          }

          this.finderForm.setValue(finder);
        });
    }
  }
  goBack() {
    this.router.navigate(['/']);
  }
  displayTrip(id: string) {
    this.router.navigate(['/trips/' + id]);
  }
  formatDate(date: string) {
    let newDate = new Date(date);
    return newDate;
  }
  onSearch() {
    this.finderService.updateFinder(this.finderForm.value).subscribe((res) => {
      console.log('updated finder:' + this.finderForm.value);
    });

    this.finderService
      .searchTrips(this.finderForm.value)
      .subscribe((trips: Trip[]) => {
        this.trips = trips;
      });
  }
}
