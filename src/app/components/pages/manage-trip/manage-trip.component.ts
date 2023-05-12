import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { AStatus } from 'src/app/enums/AStatus';
import { TStatus } from 'src/app/enums/TStatus';
import { Actor } from 'src/app/models/actor.model';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/services/message.service';
import { TripService } from 'src/app/services/trip/trip.service';

interface Response {
  res: Number;
}

@Component({
  selector: 'app-manage-trip',
  templateUrl: './manage-trip.component.html',
  styleUrls: ['./manage-trip.component.css'],
})
export class ManageTripComponent {
  tripForm: FormGroup;
  stageForm: FormGroup;
  requirements: string[];
  stages: Stage[];
  trip: Trip;
  showStageForm = false;
  showStageButton = !this.showStageForm ? '+' : '-';
  showDialog = false;
  dialogTitle = '';
  dialogMessage = '';
  action = '';
  giveReason: boolean = false;
  today: string;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private router: Router,
    private fb: FormBuilder,
    protected authService: AuthService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {
    this.trip = new Trip();
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirement: [''],
      startDate: ['', Validators.required, this.startDateValidator.bind(this)],
      endDate: ['', Validators.required, this.endDateValidator.bind(this)],
      pictures: [''],
      isPublished: [false],
    });
    this.requirements = [];
    this.stages = [];
    this.stageForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.today = new Date().toISOString().substring(0, 10); // Set current date
  }
  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.tripService.getTripById(tripId).subscribe((trip: Trip) => {
        this.trip = trip;
        this.requirements = trip.requirements;
        this.tripForm.patchValue({
          title: trip.title,
          description: trip.description,
          startDate: this.formatDate(trip.startDate),
          endDate: this.formatDate(trip.endDate),
          pictures: trip.pictures,
          isPublished: trip.isPublished,
        });
        this.stages = trip.stages;
      });
    }
  }

  onDialogYesClick(result: {
    confirmed: boolean;
    reason?: string | undefined;
  }) {
    if (this.action == 'cancel') {
      this.cancelTrip(result.reason);
    } else if (this.action == 'edit') {
      this.editTrip();
    } else if (this.action == 'delete') {
      this.deleteTrip();
    }
    this.showDialog = false;
    this.giveReason = false;
  }

  onDialogNoClick(result: boolean) {
    console.log('Dialog closed with result:', result);
    this.showDialog = false;
    this.giveReason = false;
  }

  startDateValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const today = new Date();
    const startDate = new Date(control.value);

    // Extract year, month, and day components from the dates
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startDateDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    if (startDateDate < todayDate) {
      return of({ startDateInvalid: true });
    }
    return of(null);
  }
  endDateValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const startDateControl = this.tripForm.get('startDate');
    if (!startDateControl) {
      // The startDate control is not present in the FormGroup
      return of(null);
    }

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);
    if (endDate < startDate) {
      return of({ endDateInvalid: true });
    }
    return of(null);
  }

  getMinEndDate(): string {
    const startDate = this.tripForm.get('startDate')?.value;
    return startDate ? startDate : this.today;
  }

  toggleStageForm() {
    this.showStageForm = !this.showStageForm;
    this.showStageButton = !this.showStageForm ? '+' : '-';
  }

  formatDate(date: string) {
    return date.substring(0, 10);
  }

  addStage() {
    const newStage: Stage = new Stage();
    newStage.title = this.stageForm.value.title;
    newStage.description = this.stageForm.value.description;
    newStage.price = this.stageForm.value.price;
    this.stages.push(newStage);
    this.stageForm.reset();
    this.showStageForm = false;
    this.showStageButton = '+';
  }

  onEditTrip() {
    this.showDialog = true;
    this.dialogTitle = this.translateService.instant('edit-trip');
    this.dialogMessage = this.translateService.instant('edit-dialog-message', {
      tripTitle: this.trip.title,
    });
    this.action = 'edit';
  }

  editTrip() {
    const { title, description, startDate, endDate, pictures, isPublished } =
      this.tripForm.value;
    this.trip.title = title;
    this.trip.description = description;
    this.trip.requirements = this.requirements;
    this.trip.startDate = startDate;
    this.trip.endDate = endDate;
    this.trip.stages = this.stages;
    this.trip.pictures = pictures;
    this.trip.isPublished = isPublished;

    this.tripService.editTrip(this.trip).subscribe(
      (res) => {
        if (res.errorMessage) {
          this.messageService.notifyMessage(
            'alert alert-danger',
            res.errorMessage
          );
        } else {
          this.messageService.notifyMessage(
            'alert alert-success',
            this.translateService.instant('trip-edited')
          );
        }
      },
      (err) => {
        this.messageService.notifyMessage(
          'alert alert-danger',
          err.errormessage
        );
      }
    );
  }

  cancelTrip(reason?: string) {
    this.tripService.cancelTrip(this.trip, reason).subscribe(
      (res) => {
        if (res.errorMessage) {
          this.messageService.notifyMessage(
            'alert alert-danger',
            res.errorMessage
          );
        } else {
          this.messageService.notifyMessage(
            'alert alert-success',
            this.translateService.instant('trip-cancelled')
          );
        }
      },
      (err) => {
        this.messageService.notifyMessage(
          'alert alert-danger',
          err.errormessage
        );
      }
    );
  }

  canCancelTrip(): boolean {
    const today = new Date();
    const sevenDaysFromToday = new Date();
    sevenDaysFromToday.setDate(today.getDate() + 7);
    const startDate = new Date(this.trip.startDate);
    if (startDate <= sevenDaysFromToday && startDate >= today) {
      return false;
    } else if (this.trip.status.status === TStatus.CANCELLED) {
      return false;
    } else {
      const acceptedApplication = this.checkAcceptedApplicationExists(
        this.trip
      );
      if (acceptedApplication) {
        return false;
      }
    }
    return true;
  }

  checkAcceptedApplicationExists(trip: Trip): boolean {
    for (const application of trip.applications) {
      if (application.status.status === AStatus.ACCEPTED) {
        return true;
      }
    }
    return false;
  }

  canEditOrDelete(): boolean {
    const today = new Date();
    const startDate = new Date(this.trip.startDate);
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(startDate.getDate() + 10);
    if (startDate <= tenDaysFromNow && startDate >= today) {
      return false;
    } else {
      return true;
    }
  }

  deleteTrip() {
    this.tripService.deleteTrip(this.trip).subscribe(
      (res) => {
        if (res.errorMessage) {
          this.messageService.notifyMessage(
            'alert alert-danger',
            res.errorMessage
          );
        } else {
          const currentManager: Actor = this.authService.getCurrentActor();
          if (currentManager) {
            this.router.navigateByUrl(`/trips/manage/${currentManager._id}`);
            this.messageService.notifyMessage(
              'alert alert-success',
              this.translateService.instant('trip-deleted')
            );
          }
        }
      },
      (err) => {
        this.messageService.notifyMessage(
          'alert alert-danger',
          err.errormessage
        );
      }
    );
  }

  onDeleteStage(deleteStage: Stage) {
    this.stages = this.stages.filter(
      (stage) =>
        stage.title !== deleteStage.title ||
        stage.description !== deleteStage.description
    );
  }

  onCancelTrip() {
    this.giveReason = true;
    this.showDialog = true;
    this.dialogTitle = this.translateService.instant('cancel-trip');
    this.dialogMessage = this.translateService.instant(
      'cancel-dialog-message',
      {
        tripTitle: this.trip.title,
      }
    );
    this.action = 'cancel';
  }

  onDeleteTrip() {
    this.showDialog = true;
    this.dialogTitle = this.translateService.instant('delete-trip');
    this.dialogMessage = this.translateService.instant(
      'delete-dialog-message',
      {
        tripTitle: this.trip.title,
      }
    );
    this.action = 'delete';
  }

  addRequirement() {
    const newRequirement = this.tripForm.value.requirement;
    if (newRequirement && newRequirement != '') {
      this.requirements.push(this.tripForm.value.requirement);
      this.tripForm.patchValue({ requirement: '' });
    }
  }

  removeRequirement(removeRequirement: string) {
    this.requirements = this.requirements.filter(
      (requirement) => requirement !== removeRequirement
    );
  }
}
