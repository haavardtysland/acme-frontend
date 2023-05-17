import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip/trip.service';

@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.css'],
})
export class ManageTripsComponent implements OnInit {
  searchWordForm: FormGroup;
  allTrips: Trip[];
  trips: Trip[];
  remainingTimes: { [key: string]: string };
  managerId: string;
  preCancelledTrips: Trip[];

  constructor(
    private tripService: TripService,
    private router: Router,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
    this.trips = [];
    this.allTrips = [];
    this.searchWordForm = this.fb.group({
      keyWordSearch: [''],
    });
    this.remainingTimes = {};
    this.managerId = '';
    this.preCancelledTrips = [];
  }

  navigateToCreateTrip() {
    this.router.navigate(['/trips/manage/new']);
  }

  // Custom comparison function
  compareDates(a: Trip, b: Trip): number {
    const today = new Date();
    const aDate = new Date(a.startDate);
    const bDate = new Date(b.startDate);

    // Check if trips have already started
    const aStarted = aDate < today;
    const bStarted = bDate < today;

    if (aStarted && !bStarted) {
      return 1; // a has started, b hasn't started, so a comes after b
    } else if (!aStarted && bStarted) {
      return -1; // a hasn't started, b has started, so a comes before b
    }

    const aDiff = Math.abs(aDate.getTime() - today.getTime());
    const bDiff = Math.abs(bDate.getTime() - today.getTime());

    return aDiff - bDiff;
  }

  ngOnInit(): void {
    this.managerId = this.authService.getCurrentActor()._id;
    this.tripService
      .getTripByManagerId(this.managerId)
      .subscribe((trips: Trip[]) => {
        const sortedTrips: Trip[] = trips.sort(this.compareDates);
        this.trips = sortedTrips;
        this.allTrips = sortedTrips;
      });

    setInterval(() => {
      this.trips.forEach((trip) => {
        const remainingTime = this.getRemainingTime(trip.startDate);
        this.remainingTimes[trip._id] = remainingTime;
      });
    }, 1000);

    let alltrips = localStorage.getItem('preCancelledtrips');
    if (alltrips != null) {
      this.preCancelledTrips = JSON.parse(alltrips);
    }
  }
  goBack() {
    this.router.navigate(['/']);
  }

  displayTrip(id: string) {
    this.router.navigate(['/trips/manage/edit/' + id]);
  }

  isTripPreCancelled(trip: Trip) {
    let isInList = false;
    this.preCancelledTrips.forEach((preCanTrip: Trip) => {
      if (trip._id === preCanTrip._id) {
        isInList = true;
      }
    });
    return isInList;
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

  searchWordSearch() {
    console.log(this.searchWordForm.value.keyWordSearch);
    if (this.searchWordForm.value.keyWordSearch != '') {
      this.tripService
        .getTripsBySearchword(this.searchWordForm.value.keyWordSearch)
        .subscribe((trips: Trip[]) => {
          this.trips = trips.sort(this.compareDates);
        });
    } else {
      this.trips = this.allTrips;
    }
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
        this.tripService
          .getTripByManagerId(this.managerId)
          .subscribe((trips: Trip[]) => {
            const sortedTrips: Trip[] = trips.sort(this.compareDates);
            this.trips = sortedTrips;
            this.allTrips = sortedTrips;
          });

        break;
    }
  }
  resetSearch() {
    this.tripService
      .getTripByManagerId(this.managerId)
      .subscribe((trips: Trip[]) => {
        const sortedTrips: Trip[] = trips.sort(this.compareDates);
        this.trips = sortedTrips;
        this.allTrips = sortedTrips;
      });
  }
}
