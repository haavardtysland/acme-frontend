import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css'],
})
export class ManageAccountsComponent {
  registrationForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onRegister() {
    this.authService
      .registerManager(this.registrationForm.value)
      .subscribe((res) => {
        /*       this.router.navigate(['/login']); */
        this.messageService.notifyMessage(
          'alert alert-success',
          this.translateService.instant('you-successfully-created-an-account')
        );
      });
  }
}
