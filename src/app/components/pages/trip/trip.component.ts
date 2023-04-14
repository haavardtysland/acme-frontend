import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip/trip.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
})
export class TripComponent implements OnInit {
  trip: Trip;
  id: string;

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = '0';
    this.trip = new Trip();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.tripService.getTripById(this.id).subscribe((trip) => {
      this.trip = trip;
      console.log('Display trip: ' + trip);
    });
  }
  goBack() {
    this.router.navigate(['/trips']);
  }
  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }
}
