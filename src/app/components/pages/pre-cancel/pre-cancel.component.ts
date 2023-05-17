import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { MessageService } from 'src/app/services/services/message.service';
import { TripService } from 'src/app/services/trip/trip.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pre-cancel',
  templateUrl: './pre-cancel.component.html',
  styleUrls: ['./pre-cancel.component.css'],
})
export class PreCancelComponent {
  trips: Trip[];
  selectedTrips: Trip[];
  remainingTimes: { [key: string]: string };
  constructor(
    private tripService: TripService,
    private router: Router,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {
    this.trips = [];
    this.selectedTrips = [];
    this.remainingTimes = {};
  }

  ngOnInit(): void {
    const storedTrips = localStorage.getItem('preCancelled');
    if (!storedTrips) {
      return;
    }
    this.trips = JSON.parse(storedTrips);
    console.log(this.trips);
    setInterval(() => {
      this.trips.forEach((trip) => {
        const remainingTime = this.getRemainingTime(trip.startDate);
        this.remainingTimes[trip._id] = remainingTime;
      });
    }, 1000);
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

  displayTrip(id: string) {
    this.router.navigate(['/trips/manage/edit/' + id]);
  }

  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }

  isTripStarted(tripStartDate: string) {
    const startDate = new Date(tripStartDate);
    const now = new Date();

    return startDate >= now;
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

  selectTrip(selectedTrip: Trip) {
    const trip: Trip | undefined = this.selectedTrips.find((trip) => {
      return trip._id == selectedTrip._id;
    });
    if (trip) {
      this.selectedTrips = this.selectedTrips.filter(
        (trip) => trip._id !== selectedTrip._id
      );
      return;
    }
    this.selectedTrips.push(selectedTrip);
  }

  cancelSelectedTrips() {
    //Did also try forkJoin method, the method cancelTrips() in the service uses this,
    //but seems maybe it dont work because its deprecated.
    this.selectedTrips.forEach((trip) => {
      this.tripService.cancelTrip(trip, 'Cancelled').subscribe(
        (res) => {
          if (res.errorMessage) {
            this.messageService.notifyMessage(
              'alert alert-danger',
              res.errorMessage
            );
          } else {
            this.messageService.notifyMessage(
              'alert alert-success',
              this.translateService.instant('trip-cancelled')
            );
            this.removeAsPrecancelled(trip);
          }
        },
        (err) => {
          this.messageService.notifyMessage(
            'alert alert-danger',
            err.errormessage
          );
        }
      );
    });
  }

  removeAsPrecancelled(trip: Trip) {
    const localStorageList = localStorage.getItem('preCancelled');
    if (localStorageList == null) {
      return;
    }
    const existingList: Trip[] = JSON.parse(localStorageList);
    const filteredList = existingList.filter((trip) => trip._id !== trip._id);
    this.trips = filteredList;
    const jsonString = JSON.stringify(filteredList);
    localStorage.setItem('preCancelled', jsonString);
  }
}
