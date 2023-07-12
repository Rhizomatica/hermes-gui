import { Injectable, Optional, Inject } from "@angular/core";
import { Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';

import { GlobalConstants } from '../global-constants';

export interface Message {
    source: string;
    content: string;
}

// https://indepth.dev/tutorials/angular/how-to-implement-websockets-in-angular-project

@Injectable()
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<Message>;


    constructor(@Optional() @Inject('_serviceRoute') private _serviceRoute?: string) {
        this.messages = <Subject<Message>>this.connect(`${GlobalConstants.webSocketUrl + '/websocket'}`).pipe(
            map((response: MessageEvent): Message => {
                return response.data;
                // return JSON.parse(response.data);
            })
        );
    }

    public connect(url): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });

        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}


