import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip/trip.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
})
export class TripsComponent implements OnInit {
  trips: Trip[];

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.trips = [];
  }

  ngOnInit(): void {
    this.tripService.getTrips().subscribe((trips: Trip[]) => {
      this.trips = trips;
      console.log('Display trip: ' + trips);
    });
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

}
