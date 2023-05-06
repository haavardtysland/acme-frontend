import { Component, OnInit } from '@angular/core';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { ActorService } from 'src/app/services/actor/actor.service';
import { FinderService } from 'src/app/services/finder/finder.service';
import { TripService } from 'src/app/services/trip/trip.service';

interface ManagerStats {
  managerId: string;
  tripsCount: number;
}
interface StatusCounts {
  ACCEPTED: number;
  DUE: number;
  PENDING: number;
  REJECTED: number;
  CANCELLED: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  trips: Trip[];
  actors: Actor[];
  maxTrips: number;
  minTrips: number;
  avgTrips: number;
  tripsStdDev: number;
  maxTripPrice: number;
  minTripPrice: number;
  avgTripPrice: number;
  stdDevTripPrice: number;
  minApplications: number;
  maxApplications: number;
  avgApplications: number;
  stdDevApplications: number;
  statusPrecentages: StatusCounts;
  avgFromPrice: number;
  avgToPrice: number;
  topTenWords: string[];
  managerCount: number;

  constructor(
    private tripService: TripService,
    private actorService: ActorService,
    private finderService: FinderService
  ) {
    this.trips = [];
    this.topTenWords = [];
    this.actors = [];
    this.avgTrips = 0;
    this.maxTrips = 0;
    this.minTrips = 0;
    this.tripsStdDev = 0;
    this.maxTripPrice = 0;
    this.minTripPrice = 0;
    this.avgTripPrice = 0;
    this.stdDevTripPrice = 0;
    this.minApplications = 0;
    this.maxApplications = 0;
    this.avgApplications = 0;
    this.stdDevApplications = 0;
    this.avgFromPrice = 0;
    this.avgToPrice = 0;
    this.managerCount = 0;
    this.statusPrecentages = {
      ACCEPTED: 0,
      DUE: 0,
      PENDING: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
  }

  ngOnInit(): void {
    this.getManagersCount();
    this.getTripsData();
    this.getFinderData();
  }

  getFinderData() {
    this.actorService.getAllActors().subscribe((actors: Actor[]) => {
      this.actors = actors;
      console.log('Display actors: ' + actors);

      let totalFromPrice = 0;
      let totalToPrice = 0;
      let count = 0;

      const keywordFrequency: any = {};

      for (const actor of actors) {
        if (actor.finder) {
          if (actor.finder.fromPrice != null) {
            totalFromPrice += actor.finder.fromPrice;
            count++;
          }

          if (actor.finder.toPrice != null) {
            totalToPrice += actor.finder.toPrice;
            count++;
          }
        }
      }

      for (const actor of actors) {
        if (actor.finder && actor.finder.keyWord != null) {
          const keyword = actor.finder.keyWord.toLowerCase();
          if (keyword in keywordFrequency) {
            keywordFrequency[keyword]++;
          } else {
            keywordFrequency[keyword] = 1;
          }
        }
      }
      // Sort the keywords by frequency and extract the top 10
      const top10Keywords = Object.keys(keywordFrequency)
        .sort((a, b) => keywordFrequency[b] - keywordFrequency[a])
        .slice(0, 10);

      this.topTenWords = top10Keywords;

      this.avgFromPrice = totalFromPrice / count;
      this.avgToPrice = totalToPrice / count;
    });
  }
  //TODO FIX MANAGERINFO.
  getTripsData() {
    this.tripService.getTrips().subscribe(async (trips: Trip[]) => {
      this.trips = trips;
      console.log('Display trip: ' + trips);

      const managerStats: ManagerStats[] = this.countTripsForManager();
      const managerCount = this.getManagersCount();

      // Calculate the minimum and maximum number of trips for any manager
      const tripsCounts = managerStats.map((stat) => stat.tripsCount);
      if (this.managerCount > tripsCounts.length) {
        this.minTrips = 0;
      } else {
        /*         console.log(this.getManagersCount()); */
        this.minTrips = Math.min(...tripsCounts);
      }
      this.minTrips = Math.min(...tripsCounts);
      this.maxTrips = Math.max(...tripsCounts);

      // Calculate the average number of trips for all managers
      const totalTrips = tripsCounts.reduce((a, b) => a + b, 0);
      this.avgTrips = totalTrips / managerStats.length;
      console.log(managerStats);

      this.tripsStdDev = this.calculateStdDev(tripsCounts);
      //gets applicationsdata from trips
      this.getApplicationData();
      this.calculateTripPriceValues(this.trips);
    });
  }

  getApplicationData() {
    const applicationCounts: number[] = this.trips.map(
      (trip) => trip.applications.length
    );
    this.maxApplications = Math.max(...applicationCounts);
    this.minApplications = Math.min(...applicationCounts);
    this.avgApplications =
      applicationCounts.reduce((a, b) => a + b, 0) / applicationCounts.length;
    this.stdDevApplications = Math.sqrt(
      applicationCounts.reduce(
        (sq, n) => sq + Math.pow(n - this.avgApplications, 2),
        0
      ) / applicationCounts.length
    );

    this.getApplicationStatusData();
  }

  getApplicationStatusData() {
    const statusCounts: StatusCounts = {
      ACCEPTED: 0,
      DUE: 0,
      PENDING: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    let totalApplications = 0;

    this.trips.forEach((trip) => {
      trip.applications.forEach((application) => {
        const status = application.status.status;
        if (status in statusCounts) {
          statusCounts[status]++;
          totalApplications++;
        }
      });
    });
    statusCounts.ACCEPTED = (statusCounts.ACCEPTED / totalApplications) * 100;
    statusCounts.DUE = (statusCounts.DUE / totalApplications) * 100;
    statusCounts.PENDING = (statusCounts.PENDING / totalApplications) * 100;
    statusCounts.REJECTED = (statusCounts.REJECTED / totalApplications) * 100;
    statusCounts.CANCELLED = (statusCounts.CANCELLED / totalApplications) * 100;

    this.statusPrecentages = statusCounts;
  }

  //Calculates all the price values
  calculateTripPriceValues(trips: Trip[]) {
    const tripPrices: number[] = trips.map((trip) => trip.totalPrice);

    this.maxTripPrice = Math.max(...tripPrices);
    this.minTripPrice = Math.min(...tripPrices);
    this.avgTripPrice =
      tripPrices.reduce((a, b) => a + b, 0) / tripPrices.length;
    this.stdDevTripPrice = Math.sqrt(
      tripPrices.reduce((a, b) => a + Math.pow(b - this.avgTripPrice, 2), 0) /
        tripPrices.length
    );
  }

  // Count the number of trips for each manager
  //TODO FIND ALL MANAGERS TO SEE IF THE MINIMUM CAN BE 0
  getManagersCount() {
    this.actorService.getAllActors().subscribe((actors: Actor[]) => {
      actors.forEach((actor) => {
        if (actor.role === 'MANAGER') {
          this.managerCount = this.managerCount + 1;
          console.log(actor.role);
        }
      });
    });
  }
  countTripsForManager(): ManagerStats[] {
    return this.trips.reduce((acc: ManagerStats[], trip) => {
      const managerId = trip.managerId;

      const existingManagerStats = acc.find(
        (stat) => stat.managerId === managerId
      );

      if (existingManagerStats) {
        existingManagerStats.tripsCount++;
      } else {
        acc.push({
          managerId,
          tripsCount: 1,
        });
      }

      return acc;
    }, []);
  }

  // Calculate the standard deviation of trips for all managers
  calculateStdDev(tripsCounts: number[]) {
    const tripsMean = this.avgTrips;
    const tripsVariance =
      tripsCounts.reduce(
        (acc, count) => acc + Math.pow(count - tripsMean, 2),
        0
      ) / tripsCounts.length;
    return Math.sqrt(tripsVariance);
  }
}
