import { Injectable } from '@angular/core';
import { Observable, Subject, delay } from 'rxjs';
import { InfoMessage } from 'src/app/models/info-message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private message: Subject<InfoMessage | null>;
  constructor() {
    this.message = new Subject<InfoMessage | null>();
  }
  notifyMessage = async (code: string, typeMessage: string) => {
    await this.message.next(new InfoMessage(code, typeMessage));
    await new Promise((resolve) => setTimeout(resolve, 4000));
    this.removeMessage();
  };
  removeMessage() {
    this.message.next(null);
  }

  getMessage(): Observable<InfoMessage | null> {
    return this.message.asObservable();
  }
}
