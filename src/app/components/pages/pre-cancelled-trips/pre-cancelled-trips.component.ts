import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { MessageService } from 'src/app/services/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { TStatus } from 'src/app/enums/TStatus';
import { AStatus } from 'src/app/enums/AStatus';

@Component({
  selector: 'app-pre-cancelled-trips',
  templateUrl: './pre-cancelled-trips.component.html',
  styleUrls: ['./pre-cancelled-trips.component.css'],
})
export class PreCancelledTripsComponent implements OnInit {
  trips: Trip[];
  remainingTimes: { [key: string]: string };
  selectedTrips: Trip[];

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) {
    this.trips = [];
    this.remainingTimes = {};
    this.selectedTrips = [];
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

  addToSelectedTrips(trip: Trip) {
    let isSelected = false;
    this.selectedTrips.forEach((selTrip: Trip) => {
      if (trip._id === selTrip._id) {
        isSelected = true;
      }
    });
    if (!isSelected) {
      let newSelectedTrips = this.selectedTrips;
      newSelectedTrips.push(trip);

      this.selectedTrips = newSelectedTrips;
      console.log(this.selectedTrips);
    } else {
      this.removeFromSelectedTrips(trip);
    }
  }

  removeFromSelectedTrips(trip: Trip) {
    let filteredTrips: Trip[] = [];

    this.selectedTrips.forEach((selTrip: Trip) => {
      if (trip._id != selTrip._id) {
        filteredTrips.push(selTrip);
      }
    });
    console.log(this.selectedTrips);
    this.selectedTrips = filteredTrips;
  }
  isInSelectedTrips(trip: Trip) {
    let isSelected = false;
    this.selectedTrips.forEach((selTrip: Trip) => {
      if (trip._id === selTrip._id) {
        isSelected = true;
      }
    });

    return isSelected;
  }

  cancelTrip() {
    this.selectedTrips.forEach((trip) => {
      this.undoPreCancel(trip);
    });
    this.messageService.notifyMessage(
      'alert alert-success',
      this.translateService.instant('You cancelled the trip/s')
    );
  }

  undoPreCancel(trip: Trip) {
    let listOfTrips = [];

    let alltrips = localStorage.getItem('preCancelledtrips');
    let allTripsObjs = [];
    let newTrips: Trip[] = [];

    if (alltrips != null) {
      allTripsObjs = JSON.parse(alltrips);

      allTripsObjs.filter((canTrip: Trip) => {
        trip._id != canTrip._id;
      });

      allTripsObjs.forEach((canTrip: any) => {
        if (trip._id != canTrip._id) {
          newTrips.push(canTrip);
        }
      });
      localStorage.setItem('preCancelledtrips', JSON.stringify(newTrips));

      let filteredTrips: Trip[] = [];

      newTrips.forEach((trip: Trip) => {
        if (this.canCancelTrip(trip)) {
          filteredTrips.push(trip);
        }
      });

      this.trips = filteredTrips;

      this.selectedTrips = [];
    }
  }

  canCancelTrip(trip: Trip): boolean {
    const today = new Date();
    const sevenDaysFromToday = new Date();
    sevenDaysFromToday.setDate(today.getDate() + 7);
    const startDate = new Date(trip.startDate);
    if (startDate <= sevenDaysFromToday && startDate >= today) {
      return false;
    } else if (trip.status.status === TStatus.CANCELLED) {
      return false;
    } else {
      const acceptedApplication = this.checkAcceptedApplicationExists(trip);
      if (acceptedApplication) {
        return false;
      }
    }
    return true;
  }

  checkAcceptedApplicationExists(trip: Trip): boolean {
    for (const application of trip.applications) {
      if (application.status.status === AStatus.ACCEPTED) {
        return true;
      }
    }
    return false;
  }

  isTripStarted(tripStartDate: string) {
    const startDate = new Date(tripStartDate);
    const now = new Date();

    return startDate >= now;
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
    return diffInDays <= 14;
  }

  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }

  ngOnInit(): void {
    let alltrips = localStorage.getItem('preCancelledtrips');
    let parsedTrips = [];
    let filteredTrips: Trip[] = [];
    if (alltrips != null) {
      parsedTrips = JSON.parse(alltrips);
      parsedTrips.forEach((trip: Trip) => {
        if (this.canCancelTrip(trip)) {
          filteredTrips.push(trip);
        }
      });

      this.trips = filteredTrips;
    }

    setInterval(() => {
      this.trips.forEach((trip) => {
        const remainingTime = this.getRemainingTime(trip.startDate);
        this.remainingTimes[trip._id] = remainingTime;
      });
    }, 1000);
  }
}
