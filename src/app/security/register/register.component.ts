import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  roleList: string[];

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roleList = this.authService.getRoles();
    this.registrationForm = this.fb.group({
      name: [''],
      surname: [''],
      email: [''],
      password: [''],
      phone: [''],
      address: [''],
      role: [''],
    });
  }

  onRegister() {
    this.authService.registerUser(this.registrationForm.value).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}
}
