import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { Finder } from 'src/app/models/finder.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { FinderService } from 'src/app/services/finder/finder.service';
import { TripService } from 'src/app/services/trip/trip.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
})
export class TripsComponent implements OnInit {
  finderForm: FormGroup;
  searchWordForm: FormGroup;
  trips: Trip[];
  remainingTimes: { [key: string]: string };

  constructor(
    private tripService: TripService,
    private finderService: FinderService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
    this.trips = [];
    this.searchWordForm = this.fb.group({
      keyWordSearch: [''],
    });
    this.remainingTimes = {};
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
      this.trips = this.filterPublishedTrips(trips);
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
    setInterval(() => {
      this.trips.forEach((trip) => {
        const remainingTime = this.getRemainingTime(trip.startDate);
        this.remainingTimes[trip._id] = remainingTime;
      });
    }, 1000);
  }
  goBack() {
    this.router.navigate(['/']);
  }
  displayTrip(id: string) {
    this.router.navigate(['/trips/' + id]);
  }
  filterPublishedTrips(trips: Trip[]) {
    return trips.filter((trip) => trip.isPublished == true);
  }
  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }
  isTripSoon(tripStartDate: string): boolean {
    const startDate = new Date(tripStartDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ) -
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    return diffInDays <= 7;
  }
  getRemainingTime(tripStartDate: string): string {
    const startDate = new Date(tripStartDate);
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days} d, ${hours} h, ${minutes} m, ${seconds} s`;
  }

  isTripStarted(tripStartDate: string) {
    const startDate = new Date(tripStartDate);
    const now = new Date();

    return startDate >= now;
  }
  onSearch() {
    if (this.authService.getCurrentActor()) {
      this.finderService
        .updateFinder(this.finderForm.value)
        .subscribe((res) => {
          console.log('updated finder:' + this.finderForm.value);
        });
    }

    this.finderService
      .searchTrips(this.finderForm.value)
      .subscribe((trips: Trip[]) => {
        this.trips = this.filterPublishedTrips(trips);
      });
  }

  resetSearch() {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.trips = this.filterPublishedTrips(trips);
    });
  }

  sortTrips(event: any) {
    const selectedValue = event.target.value;
    switch (selectedValue) {
      case '1':
        // Sort trips by price: low to high
        this.trips.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case '2':
        // Sort trips by price: high to low
        this.trips.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case '3':
        // Sort trips by date: closest
        this.trips.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case '4':
        // Sort trips by date: furthest
        this.trips.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      default:
        this.tripService.getTrips().subscribe((trips: Trip[]) => {
          this.trips = this.filterPublishedTrips(trips);
        });

        break;
    }
  }

  searchWordSearch() {
    console.log(this.searchWordForm.value.keyWordSearch);
    if (this.searchWordForm.value.keyWordSearch != '') {
      this.tripService
        .getTripsBySearchword(this.searchWordForm.value.keyWordSearch)
        .subscribe((trips: Trip[]) => {
          this.trips = this.filterPublishedTrips(trips);
        });
    }
  }
}
