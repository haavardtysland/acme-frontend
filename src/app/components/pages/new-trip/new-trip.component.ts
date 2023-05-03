import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tripService: TripService
  ) {
    this.tripForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirement: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
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
  }

  onCreateNewTrip() {
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
