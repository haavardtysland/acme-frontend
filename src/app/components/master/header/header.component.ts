import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private messageService: MessageService, private router: Router) {}
  changeLanguage(languare: string) {
    this.messageService.notifyMessage(
      'alert alert-info',
      'You changed language to: ' + languare
    );
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
