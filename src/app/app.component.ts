import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'acme-explorer';

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    const locale = localStorage.getItem('locale');
    this.translateService.setDefaultLang(locale || 'en');
    this.translateService.use(locale || 'en');
  }

  ngOnInit(): void {
    this.authService.useRefreshToken().subscribe((res) => {
      console.log(res);
      if (res['actor'] != null && res['accessToken'] != null) {
        console.log('hei');
        localStorage.setItem('token', res['accessToken']);
      }
    });
  }
}
