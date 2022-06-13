import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { GlobalConstants } from '../../../global-constants';
import { DomSanitizer } from '@angular/platform-browser';
import { ScriptService } from '../../../_services/script.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  providers: [DecimalPipe],
})

export class RadioComponent implements OnInit, OnDestroy {
  public radio: any = []
  error: Error;
  currentUser: User;
  isAdmin = false;
  radioRemoteUrl: any;
  uhrrScript: any;
  errorAlert:false;

  constructor(
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private scriptService: ScriptService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
    this.isAdmin = this.currentUser.admin
  }

  closeError() {
    this.errorAlert = false
  }

  ngOnInit(): void {
    this.scriptService.load('uhrr').then(data => {
      this.uhrrScript = data[0]
      console.log(this.uhrrScript)
      if (!this.uhrrScript.loaded)
        console.log('ERROR') // TODO - ALERT

    }).catch(error => {
      console.log(error) // TODO - ALERT
    });

    this.radioRemoteUrl = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.radioRemoteUrl + "www/controls.js");
  }

  ngOnDestroy() {
  }
}

