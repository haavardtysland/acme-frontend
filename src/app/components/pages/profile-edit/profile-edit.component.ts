import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Actor } from 'src/app/models/actor.model';
import { ActorService } from 'src/app/services/actor/actor.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  editProfileForm: FormGroup;
  actor: Actor;
  passwordInput: FormGroup;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private actorService: ActorService,
    private messageService: MessageService
  ) {
    this.actor = new Actor();
    this.editProfileForm = fb.group({
      name: [''],
      surname: [''],
      email: [''],
      phone: [''],
      address: [''],
    });
    this.passwordInput = fb.group({
      password: [''],
    });
  }

  ngOnInit(): void {
    this.actor = this.authService.getCurrentActor();
    this.editProfileForm.setValue({
      name: this.actor.name,
      surname: this.actor.surname,
      phone: this.actor.phone,
      email: this.actor.email,
      address: this.actor.address,
    });
  }

  onSave() {
    this.actorService
      .updateActor(this.editProfileForm.value)
      .subscribe((res: any) => {
        this.messageService.notifyMessage(
          'alert alert-success',
          'You successfully changed your user '
        );
      });
  }

  onChangePassword() {
    this.actorService
      .updateActor(this.passwordInput.value)
      .subscribe((res: any) => {
        this.messageService.notifyMessage(
          'alert alert-success',
          'You successfully changed your password '
        );
      });
    console.log(this.passwordInput.value);
  }
}
