import { Component } from '@angular/core';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css'],
})
export class TripsComponent /* implements OnInit */ {
  /* trip: Trip[];
  id: string;

  constructor(private tripService TripService, private router: Router, private route: ActivatedRoute){
    this.trip = [];
  }

  ngOnInit(): void {
      this.id = this.route.snapshot.params["id"];

      this.tripService.getTrip(this.id).subscribe ((trip) => {
        this.trip = trip;
        console.log("Display trip: " + trip);
      })
  }
  goBack(){
    this.router.navigate(["/"]);
  }
  displayTrip(id: string){
    this.router.navigate(["/trips/" + id]);
  }
 */
}
