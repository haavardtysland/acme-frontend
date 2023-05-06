import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/services/message.service';
import { TripService } from 'src/app/services/trip/trip.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.css'],
})
export class ManageApplicationsComponent implements OnInit {
  trips: Trip[];
  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private messageService: MessageService,
    private translateService: TranslateService
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

  rejectApplicaiton = async (applicationId: string) => {
    const status = 'REJECTED';
    const description = 'Your application was rejected';
    await this.tripService
      .changeApplicationStatus(applicationId, status, description)
      .subscribe((res) => {
        console.log('status updeted', res);
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await location.reload();

    this.messageService.notifyMessage(
      'alert alert-success',
      this.translateService.instant('you-successfully-rejected-the-application')
    );
  };

  changeApplicationToDue = async (applicationId: string) => {
    const status = 'DUE';
    const description = 'Awaiting payment';
    await this.tripService
      .changeApplicationStatus(applicationId, status, description)
      .subscribe((res) => {
        console.log('status updeted', res);
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await location.reload();

    this.messageService.notifyMessage(
      'alert alert-success',
      this.translateService.instant(
        'you-successfully-approved-the-application-for-payment'
      )
    );
  };

  formatDate(date: string) {
    let newDate = new Date(date);
    let stringDate = newDate.toString();
    let finDate = stringDate.substring(0, 10);
    return finDate;
  }
}
