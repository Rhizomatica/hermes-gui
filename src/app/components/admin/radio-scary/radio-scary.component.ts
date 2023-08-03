import { Component, OnInit, OnDestroy } from '@angular/core';
import { RadioService } from '../../../_services/radio.service';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { interval } from 'rxjs';

@Component({
  selector: 'app-radio-scary',
  templateUrl: './radio-scary.component.html',
  styleUrls: ['./radio-scary.component.less'],
  providers: [DecimalPipe]
})

export class RadioScaryComponent implements OnInit {

  public radio: any = []
  error: Error
  errorAlert: Boolean
  res: any
  bfo: any
  mastercal: any
  radioError: Boolean
  currentUser: User
  isAdmin: Boolean
  
  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getRadioStatus(): void {
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio = res;
        this.bfo = this.radio.bfo;
        this.mastercal = this.radio.mastercal;
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
      }
    );
  }

  changeBfo(f: NgForm) {
    this.radioService.setRadioBfo(f.value.bfo).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.bfo = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeMasterCall(f: NgForm) {
    this.radioService.setRadioMastercal(f.value.mastercal).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.mastercal = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    this.getRadioStatus();
    this.isAdmin = this.currentUser && this.currentUser.admin
  }
}

