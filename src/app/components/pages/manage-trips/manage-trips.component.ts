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
  trips: Trip[];
  remainingTimes: { [key: string]: string };
  managerId: string;

  constructor(
    private tripService: TripService,
    private router: Router,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
    this.trips = [];
    this.searchWordForm = this.fb.group({
      keyWordSearch: [''],
    });
    this.remainingTimes = {};
    this.managerId = '';
  }

  ngOnInit(): void {
    this.managerId = this.authService.getCurrentActor()._id;
    this.tripService
      .getTripByManagerId(this.managerId)
      .subscribe((trips: Trip[]) => {
        this.trips = trips;
        console.log('Display trip: ' + trips);
      });

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
    this.router.navigate(['/trips/manage/edit/' + id]);
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

  searchWordSearch() {
    console.log(this.searchWordForm.value.keyWordSearch);
    if (this.searchWordForm.value.keyWordSearch != '') {
      this.tripService
        .getTripsBySearchword(this.searchWordForm.value.keyWordSearch)
        .subscribe((trips: Trip[]) => {
          this.trips = trips;
        });
    }
  }
}
