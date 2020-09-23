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

}
