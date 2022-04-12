import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../../global-constants';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  providers: [DecimalPipe],
})

export class RadioComponent implements OnInit, OnDestroy {
  public radio: any = [];
  error: Error;
  currentUser: User;
  isAdmin = false;
  audio: any;


  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
    this.isAdmin = this.currentUser.admin
  }


  setAudioHtml() {
    this.audio = `<audio src='${GlobalConstants.ubitxv6Url}' type='audio/webm' controls />`
  }

  testeAudioCORSPolicy() {
    this.http.get('http://10.8.0.2:9999').subscribe(data => {
      console.log("CORS POLICY TESTE - " + data)
    })
  }

  ngOnInit(): void {
    // this.setAudioHtml()
    this.testeAudioCORSPolicy()
  }

  ngOnDestroy() {
    console.log('quiting radio')
  }
}

