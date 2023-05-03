import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.css'],
})
export class NewTripComponent {
  constructor(private router: Router) {}
}
