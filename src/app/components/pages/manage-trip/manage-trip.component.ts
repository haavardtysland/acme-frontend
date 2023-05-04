import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip/trip.service';

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

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private router: Router,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {
    this.trip = new Trip();
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirement: [''],
      startDate: ['', Validators.required, this.startDateValidator.bind(this)],
      endDate: ['', Validators.required, this.endDateValidator.bind(this)],
      pictures: [''],
    });
    this.requirements = [];
    this.stages = [];
    this.stageForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
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
        });
        this.stages = trip.stages;
      });
    }
  }

  startDateValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const today = new Date();
    const startDate = new Date(control.value);
    if (startDate < today) {
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
    if (endDate <= startDate) {
      return of({ endDateInvalid: true });
    }
    return of(null);
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

  onEditNewTrip() {
    const { title, description, startDate, endDate } = this.tripForm.value;
    this.trip.title = title;
    this.trip.description = description;
    this.trip.requirements = this.requirements;
    this.trip.startDate = startDate;
    this.trip.endDate = endDate;
    this.trip.stages = this.stages;
    this.tripService.editTrip(this.trip).subscribe((res) => {
      console.log(res);
    });
  }

  onDeleteStage(deleteStage: Stage) {
    this.stages = this.stages.filter((stage) => stage.id !== deleteStage.id);
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
