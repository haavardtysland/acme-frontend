import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { MessageService } from 'src/app/services/services/message.service';
import { TripService } from 'src/app/services/trip/trip.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
})
export class TripComponent implements OnInit {
  trip: Trip;
  id: string;
  comments: string[];
  comment: string = '';
  isApplying: boolean = false;

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private translateService: TranslateService,
    protected authService: AuthService,
    protected modalService: ModalService
  ) {
    this.id = '0';
    this.trip = new Trip();
    this.comments = [];
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

  addComment() {
    this.comments.push(this.comment);
    this.comment = '';
    console.log(this.comments);
  }

  apply() {
    const nowDate = new Date();
    const tripDate = new Date(this.trip.startDate);
    console.log();

    if (nowDate <= tripDate) {
      this.tripService.applyForTrip(this.trip._id, this.comments).subscribe(
        (res) => {
          if (res.errorMessage) {
            this.messageService.notifyMessage(
              'alert alert-danger',
              res.errorMessage
            );
          } else {
            this.messageService.notifyMessage(
              'alert alert-success',
              'You successfully applied for the trip'
            );
            this.cancelApplication();
          }
        },
        (err) => {
          console.error('Error applying for trip:', err);
          this.messageService.notifyMessage(
            'alert alert-danger',
            err.errormessage
          );
        }
      );
    } else {
      this.messageService.notifyMessage(
        'alert alert-danger',
        this.translateService.instant('this-trip-has-already-started!')
      );
    }
  }

  openApplicationForm() {
    this.isApplying = true;
  }

  cancelApplication() {
    this.isApplying = false;
    this.comments = [];
  }

  removeComment(comment: string) {
    const index = this.comments.indexOf(comment);
    console.log(comment);
    if (index !== -1) {
      this.comments.splice(index, 1);
    }
  }
}
