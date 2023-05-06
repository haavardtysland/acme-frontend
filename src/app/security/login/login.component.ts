import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.minLength(8)],
    });
  }

  ngOnInit(): void {}

  onLogin() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.login(email, password).subscribe((res: any) => {
      if (res['id'] != null && res['token'] != null) {
        localStorage.setItem('token', res['token']);
        this.router.navigate(['/']);
      } else {
        this.messageService.notifyMessage(
          'alert alert-danger',
          this.translateService.instant(
            'please-enter-the-correct-email-and-password'
          )
        );
      }
    });
  }
}
