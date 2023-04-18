import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'acme-explorer';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.useRefreshToken().subscribe((res) => {
      console.log(res);
      if (res['actor'] != null && res['accessToken'] != null) {
        localStorage.setItem('id', res['actor']['_id']);
        localStorage.setItem('token', res['accessToken']);
      }
    });
  }
}
