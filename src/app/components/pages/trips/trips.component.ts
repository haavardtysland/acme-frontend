import { Component } from '@angular/core';
import { TripService } from 'src/app/services/trip/trip.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent {

  constructor(  private tripService: TripService ){}
    
  ngOnInit(){
    this.tripService.getTrips().subscribe((res) => {
      console.log(res);
    });

    this.tripService.getTripById("642317d43132e5c5cd2a13b4").subscribe((res) => {
      console.log(res);
    })
  }
}
