import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip/trip.service';

interface GroupedApplications {
  [key: string]: Array<{ tripTitle: string; application: any; tripId: number }>;
}

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
  template: `
    <div>
      <ngx-datatable [rows]="rows" [columns]="columns"> </ngx-datatable>
    </div>
  `,
})
export class ApplicationsComponent implements OnInit {
  trips: Trip[];
  groupedApplications: GroupedApplications;
  id: string;
  constructor(
    private tripService: TripService,
    private authService: AuthService
  ) {
    this.trips = [];
    this.id = '';
    this.groupedApplications = {};
  }
  ngOnInit(): void {
    this.id = this.authService.getCurrentActor()._id;
    this.tripService.getTripByExlorerId(this.id).subscribe((trips: Trip[]) => {
      this.trips = trips;
      this.filterTrips();
    });
  }

  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }

  filterTrips() {
    const matchedApplications: any[] = [];

    this.trips.forEach((trip) => {
      trip.applications
        .filter((application) => application.explorerId === this.id)
        .forEach((application) => {
          matchedApplications.push({
            tripTitle: trip.title,
            tripId: trip._id,
            application: application,
          });
        });
    });
    const matchedApplicationsGrouped = matchedApplications.reduce(
      (groups, application) => {
        const status = application.application.status.status;
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(application);
        return groups;
      },
      {}
    );

    this.groupedApplications = matchedApplicationsGrouped;
  }
}
