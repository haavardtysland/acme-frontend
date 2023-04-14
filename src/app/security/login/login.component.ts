import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    private fb: FormBuilder
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
        localStorage.setItem('id', res['id']);
        localStorage.setItem('token', res['token']);
        this.router.navigate(['/']);
      }
    });
  }
}
