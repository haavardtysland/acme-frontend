import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  roleList: string[];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {
    this.roleList = this.authService.getRoles();
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.pattern(/^[0-9+]+$/)],
      address: ['', Validators.minLength(2)],
    });
  }

  onRegister() {
    this.authService
      .registerUser(this.registrationForm.value)
      .subscribe((res) => {
        this.router.navigate(['/login']);
        this.messageService.notifyMessage(
          'alert alert-success',
          this.translateService.instant('you-successfully-created-an-account')
        );
      });
  }

  ngOnInit(): void {}
}
