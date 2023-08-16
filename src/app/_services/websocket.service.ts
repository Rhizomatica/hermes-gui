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
    private subject: AnonymousSubject<MessageEvent>
    public messages: Subject<Message>
    public ws: WebSocket
    
    constructor(@Optional() @Inject('_serviceRoute') private _serviceRoute?: string) { }

    public startService() {
        this.messages = <Subject<Message>>this.connect(`${GlobalConstants.webSocketUrl}`).pipe(
            map((response: MessageEvent): Message => {
                return JSON.parse(response.data)
            })
        );
    }

    public connect(url): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url)
        }
        return this.subject;
    }

    private create(url): AnonymousSubject<MessageEvent> {
        this.ws = new WebSocket(url);

        let observable = new Observable((obs: Observer<MessageEvent>) => {
            this.ws.onmessage = obs.next.bind(obs)
            this.ws.onerror = obs.error.bind(obs)
            this.ws.onclose = obs.complete.bind(obs)
            return this.ws.close.bind(this.ws)
        });

        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data))
                }
            }
        };

        return new AnonymousSubject<MessageEvent>(observer, observable)
    }
}


