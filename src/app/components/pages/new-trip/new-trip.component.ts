import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Stage } from 'src/app/models/stage.model';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip/trip.service';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.css'],
})
export class NewTripComponent {
  tripForm: FormGroup;
  stageForm: FormGroup;
  requirements: string[];
  stages: Stage[];
  showStageForm = false;
  showStageButton = !this.showStageForm ? '+' : '-';
  showDialog = false;
  dialogTitle = '';
  dialogMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tripService: TripService
  ) {
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
      price: [0, Validators.required],
    });
  }

  onDialogYesClick(result: boolean) {
    if (result) {
      let trip: Trip = new Trip();
      const { title, description, startDate, endDate } = this.tripForm.value;
      trip.title = title;
      trip.description = description;
      trip.requirements = this.requirements;
      trip.startDate = startDate;
      trip.endDate = endDate;
      trip.stages = this.stages;
      this.tripService.createTrip(trip).subscribe((res) => {
        console.log(res);
      });
    }
    this.showDialog = false;
  }

  onDialogNoClick(result: boolean) {
    console.log('Dialog closed with result:', result);
    this.showDialog = false;
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

  onCreateNewTrip() {
    this.showDialog = true;
    this.dialogTitle = 'Create trip';
    this.dialogMessage = 'Create trip??';
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
