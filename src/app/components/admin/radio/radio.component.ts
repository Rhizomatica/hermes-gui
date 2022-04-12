import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../../global-constants';
import { DomSanitizer } from '@angular/platform-browser';

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
  universalHRHH5Url: any;
  
  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private sanitizer: DomSanitizer) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
    this.isAdmin = this.currentUser.admin
  }

  ngOnInit(): void {
    alert("You`re listening radio Hermes")
    this.universalHRHH5Url = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.universalHRHH5);
  }

  ngOnDestroy() {
    console.log('quiting radio')
  }
}

