import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/enums/RoleEnum';
import { Actor } from 'src/app/models/actor.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  protected currentActor: Actor | undefined;
  protected activeRole: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getStatus().subscribe((loggedIn) => {
      if (loggedIn) {
        this.currentActor = this.authService.getCurrentActor();
        this.activeRole = this.currentActor.role;
      } else {
        this.activeRole = Role.ANONYMOUS;
        this.currentActor = undefined;
      }
    });
  }

  changeLanguage(language: string) {
    this.messageService.notifyMessage(
      'alert alert-info',
      'You changed language to: ' + language
    );

    localStorage.setItem('locale', language);

    location.reload();
  }

  useRefreshToken() {
    this.authService.useRefreshToken().subscribe((res) => {
      console.log(res);
    });
  }

  logOut() {
    this.authService.logout().subscribe((res) => {
      console.log(res);
    });
    this.router.navigate(['login']);
  }
}
