import { Injectable, Optional, Inject } from "@angular/core";
import { Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';

import { GlobalConstants } from '../global-constants';
import { SharedService } from "./shared.service";
import { Radio } from "../interfaces/radio";
import { UtilsService } from "./utils.service";
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { RadioService } from "./radio.service";
import { resourceUsage } from "process";

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
    private requireLogin: boolean = GlobalConstants.requireLogin

    constructor(@Optional() @Inject('_serviceRoute') private _serviceRoute?: string,
        private sharedService?: SharedService,
        private utils?: UtilsService,
        private radioService?: RadioService,
        private router?: Router) { }

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

        }, async err => {

            if (this.ws && this.ws.OPEN == 1)
                this.closeConnection()

            this.keepWebSocketAlive()

            if (self.location.hostname === 'demo.hermes.radio')
                this.sharedService.mountRadioObjDemo()

        }, () => {
            console.log('complete, closing websocket connection...')
        })
    }

    keepWebSocketAlive() {
        const subs = this.intervallTimerKeepWebSocketAlive.subscribe(val => {
            console.log('keep alive...')
            this.startService()
            this.subscribeMessages()
        });
    }

    closeConnection() {

        //TODO - Dual frequency
        // this.changeOperateModeProfile()

        if (this.requireLogin && this.ws && this.ws.OPEN == 1) {
            this.ws.close()
            this.messages.complete()
            this.messages = null
            this.ws = null
            this.subject = null
        }
    }

    changeOperateModeProfile() {
        if (this.radioObj && this.radioObj.profile == 1) {
            //Profile id = 1 - digital/data
            this.radioService.changeOperateModeProfile(1).subscribe(
                (res: any) => {
                    return res
                }
            );
        }

    }
}


