import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private messageService: MessageService) {}
  changeLanguage(languare: string) {
    this.messageService.notifyMessage(
      'alert alert-info',
      'You changed language to: ' + languare
    );
  }
}
