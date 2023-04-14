import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip/trip.service';

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.css'],
})
export class ManageApplicationsComponent implements OnInit {
  trips: Trip[];
  constructor(
    private tripService: TripService,
    private authService: AuthService
  ) {
    this.trips = [];
  }
  ngOnInit(): void {
    const id = this.authService.getCurrentActor()?._id;
    if (!id) {
      console.log('No id found');
      return;
    }
    this.tripService.getTripByManagerId(id).subscribe((trips: Trip[]) => {
      this.trips = trips;
    });
  }

  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }
}
