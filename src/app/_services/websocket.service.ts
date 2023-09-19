import { Injectable, Optional, Inject } from "@angular/core";
import { Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';

import { GlobalConstants } from '../global-constants';
import { SharedService } from "./shared.service";
import { Radio } from "../interfaces/radio";
import { UtilsService } from "./utils.service";
import { Router } from '@angular/router';
import { CustomError } from "../interfaces/customerror";
import { CustomErrorsService } from 'src/app/_services/custom-errors.service';
import { interval } from 'rxjs';

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
    public radioObj: Radio
    public intervallTimerKeepWebSocketAlive = interval(9000)
    private generalLogin: boolean = GlobalConstants.generalLogin

    constructor(@Optional() @Inject('_serviceRoute') private _serviceRoute?: string,
        private sharedService?: SharedService,
        private utils?: UtilsService,
        private router?: Router,
        private errorService?: CustomErrorsService

    ) { }

    public startService() {
        console.log('Starting websocket...')
        this.messages = <Subject<Message>>this.connect(`${GlobalConstants.webSocketUrl}`).pipe(
            map((response: MessageEvent): Message => {
                return JSON.parse(response.data)
            })
        );

        this.subscribeMessages()
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


    subscribeMessages() {

        this.sharedService.radioObj.subscribe({
            next: newValue => this.radioObj
        });

        this.messages.subscribe(data => {
            this.sharedService.setRadioObjShared(data)
            this.checkingPTTHardwareCommand()

        }, async err => {

            this.saveWebsocketError()

            if (this.ws && this.ws.OPEN == 1)
                this.closeConnection()

            this.keepWebSocketAlive()

            if (self.location.hostname === 'hermes.radio')
                this.sharedService.mountRadioObjDemo()

        }, () => {
            console.log('complete, closing websocket connection...')
        })
    }

    checkingPTTHardwareCommand() {
        if (this.utils.isItRuningLocal() && this.utils.isSBitxRadio() && this.radioObj.ptt) {
            this.router.navigate(['/voice'])
        }
    }

    async saveWebsocketError(): Promise<void> {

        var newError: CustomError = {
            controller: 'websocket',
            error_code: 500,
            error_message: 'Error to connect on websocket service',
            stacktrace: null,
            created_at: new Date().toString(),
            updated_at: new Date().toString()
        }

        // this.loading = true
        await this.errorService.newCustomError(newError).subscribe(
            (res: any) => {
                // this.loading = false
            }, (err) => {
                // this.loading = false
            }
        );
    }

    keepWebSocketAlive() {
        const subs = this.intervallTimerKeepWebSocketAlive.subscribe(val => {
            console.log('keep alive...')
            this.startService()
            this.subscribeMessages()
        });
    }

    closeConnection() {
        if (this.generalLogin && this.ws && this.ws.OPEN == 1) {
            this.ws.close()
            this.messages.complete()
            this.messages = null
            this.ws = null
            this.subject = null
        }
    }
}


