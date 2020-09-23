import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Message } from './message';
import { MESSAGES } from './mock-messages';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private alertService: AlertService) { }

getMessages(): Observable<Message[]> {
  this.alertService.add('mensagem selecionada');
  return of(MESSAGES);
}

getMessage(id:number): Observable<Message> {
  this.alertService.add('selecionada mensagem id=${id}');
  return of (MESSAGES.find(message => message.id === id));
}

}
