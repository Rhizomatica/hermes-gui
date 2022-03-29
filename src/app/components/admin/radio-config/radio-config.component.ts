import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../_services/api.service';
import { RadioService } from '../../../_services/radio.service';
import { NgForm } from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { interval } from 'rxjs';
import { Router} from '@angular/router';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less'],
  providers: [DecimalPipe],

})

export class RadioConfigComponent implements OnInit, OnDestroy {
  public radio: any = [];
  error: Error;
  alterFreq = false;
  alterSet = false;
  confirmSet = false;
  res: any;
  ptt: any;
  bfo: any;
  mastercal: any;
  freq: any;
  frek: any;
  realfreq: any;
  reseting = false;
  usb = true;
  mode: any;
  led: any;
  protection: any;
  bypass: any;
  public realValue: number;
  public freqmin = 500;
  public freqmax = 30000;
  errorAlert = false;
  radioError = false;
  testtone = '0';
  toneOn = false;
  currentUser: User;
  isAdmin = false;
  refthreshold: any;
  public min = 500000;
  public max = 300000000;
  public intervallTimer = interval(500);
  private subscription;
  fwdw: any;
  refv: any;
  fwd_raw: any;
  ref_raw: any;
  tx = false;
  rx = false;
  power: any;


  constructor(
	  private apiService: ApiService,
    private authenticationService: AuthenticationService,
	  private radioService: RadioService,
	  private decimalPipe: DecimalPipe,
    private router: Router) { 
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getRadioStatus(): void{
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {

        console.log(res)

        // if(!this.refv){
        //   console.log("maoi")
        // } 

        this.radio = res;

        // if(!this.radio.refv){
        //   //TODO - Redirecionar/travar tela
        // }

        //TODO - criar metodo 
        this.radio.extra = false;
        this.bfo = this.radio.bfo;
        this.mastercal = this.radio.mastercal;
        this.freq = this.radio.freq;
        this.frek = this.radio.freq / 1000;
        this.mode = this.radio.mode;
        this.led = this.radio.led;
        this.protection = this.radio.protection;
        this.bypass = this.radio.bypass;
        this.refthreshold = this.radio.refthreshold;
        this.radio.fwd_watts = this.radio.fwd_watts;
        this.fwdw = this.radio.fwd_watts;
        this.fwd_raw = this.radio.fwd_raw;
        this.radio.ref_volts = this.radio.ref_volts;
        this.refv = this.radio.ref_volts;
        this.ref_raw = this.radio.ref_raw;

        if (this.radio.bypass === true) {
          this.bypass = true;
        } else {
          this.bypass = false;
        }
        if (this.radio.tx) {
          this.ptt = 'ON';
        } else {
          this.ptt = 'OFF';
        }
        console.log(this.radio);
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
        console.log(this.error);
      }
    );
  }

  getPttswr(): void{
    this.radioService.getRadioPttswr().subscribe(
      (res: any) => {
        this.power = res;
        this.radio.tx = this.power.tx;
        this.radio.led = this.power.led;
        this.led = this.power.led;
        this.radio.protection = this.power.protection;
        this.radio.bypass = this.power.bypass;
        this.radio.fwd_watts = this.power.fwd_watts;
        this.radio.fwd_raw = this.power.fwd_raw;
        this.radio.ref_volts = this.power.ref_volts;
        this.radio.ref_raw = this.power.ref_raw;

        if (this.radio.bypass === true) {
          this.bypass = true;
        } else {
          this.bypass = false;
        }

        if (this.radio.tx) {
          this.ptt = 'ON';
        } else {
          this.ptt = 'OFF';
        }
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
        console.log(this.error);
      }
    );
  }


  get value() : number {
    this.realValue = this.radio.freq;
    return this.realValue;
	}
  set value(newValue: number) {
    this.realValue = newValue;
    if( this.realValue < this.freqmin ){
      this.realValue = undefined;
      setTimeout(() => { this.realValue = this.freqmin; });
    }
    else if(this.realValue > this.freqmax){
      this.realValue = undefined;
      setTimeout(() => { this.realValue = this.freqmax; });
    }
  }


  changePtt(f) {
	  console.log (f);
    this.radioService.setRadioPTT(f).subscribe(
      (res: any) => {
        this.res = res;
        console.log (this.ptt);
        this.radio.ptt = res;
        this.ptt = f;
        if (this.ptt === 'ON') {
          this.radio.tx = true;
          this.radio.rx = false;
        } else {
          this.radio.tx = false;
          this.radio.rx = true;
        }
       console.log('⚚ radio config - set ptt- : res: ', res);
        console.log (this.ptt);
        this.radio.ptt = res;
        this.getRadioStatus;
        // this.fileIsProcessing = true;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getRadioStatus;
      }
    );
  }

  public pttOn(f) {
    this.radioService.setRadioPTT(f).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config - set ptt- : res: ', res);
        console.log (this.ptt);
        this.radio.ptt = res;
        this.ptt = f;
        this.radio.tx = true;
        this.radio.rx = false;
        console.log('on');
      },
      (err) => {
       this.error = err;
        this.errorAlert = true;
      }
    );
    
    this.getPttswr();
  }

  confirmReset() {
    if (this.reseting) {
      this.reseting = false;
    } else {
      this.reseting = true;
    }
  }

  screenFreq(): void {
    if (this.alterFreq === false) {
      this.alterFreq = true;
    } else {
      this.alterFreq = false;
    }
  }

  changeRadioFreqMode(f: NgForm) {
    this.radioService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.freq = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        }, (err) => {
        this.error =  err;
        this.errorAlert = true;
        }
    );

    this.radioService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeFreqMode- setRadioMode: res: ', res);
      }, (err) => {
        this.error =  err;
        this.errorAlert = true;
      }
    );
  }

  changeFrequency(f: NgForm) {
    const realfreq = f.value.frek * 1000;
	  console.log(realfreq);
    this.radioService.setRadioFreq(realfreq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        this.radio.freq = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    // filter if is number
    // filter range
  }

  changeMode(f: NgForm) {
    this.radioService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.mode = res;
      }, (err) => {
        this.error =  err;
        this.errorAlert = true;
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

  changeMasterCall(f: NgForm){
    this.radioService.setRadioMastercal(f.value.mastercal).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeMastercall- setRadioMastercal: res: ', res);
        this.radio.mastercal = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeByPass(f: NgForm){
    this.radioService.setRadioBypass(f.value.bypass).subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.bypass = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeRefThreshold(f: NgForm){
    this.radioService.setRadioRefThreshold(f.value.refthreshold).subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.refthreshold = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  confirmChange(){
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
  }

  screenSet() {
    if (this.alterSet === false) {
      this.alterSet = true; 
      if (this.confirmSet) {
        this.confirmSet = false;
      } else {
        this.confirmSet = true;
      }
    } else {
      this.alterSet = false;
    }
  }

  setDefaults() {
    this.radioService.radioSetDefaults().subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.refthreshold = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  resetProtection() {
    // console.log('teste');
    this.radioService.radioResetProtection().subscribe(
      (res: any) => {
      this.res = res;
      
      console.log('⚚ radio config - reset radio: res: ', res);
      if (this.res === 1) {
        this.radio.protection = false;
      }
      this.getRadioStatus();
      },
      (err) => {
      this.error = err;
      this.errorAlert = true;
      }
    );
  }

  async resetRadio() {
    console.log('reset');
    await this.radioService.radioRestoreDefaults().subscribe(
      (res: any) => {
      this.res = res;
      console.log('⚚ radio reset: ', res);
      this.reseting = false;
      this.getRadioStatus();
      },
      (err) => {
      this.error = err;
      this.errorAlert = true;
      this.reseting = false;
      this.getRadioStatus();
      }
    );
    console.log('⚚ testradio - reset to defaults ');
    }

  closeError() {
    this.errorAlert = false;
  }

  submitSet() {
    if (this.confirmSet === false) {
      this.confirmSet = true;
    } else {
      this.confirmSet = false;
    }
  }

  testTone(f) {
    this.testtone = f;
    console.log(f);
    console.log(this.toneOn);
    this.radioService.setRadioTone(f).subscribe(
      (res: any) => {
        this.res = res;
		    this.radio.testtone = res;
      if (res === '0') {
          this.toneOn = false;
        } else {
          this.toneOn = true;
        }
        this.getRadioStatus();
        // this.fileIsProcessing = true;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getRadioStatus();
      }
    );
  }

  ngOnInit(): void {
    this.getRadioStatus();
    this.getPttswr();
    this.subscription = this.intervallTimer.subscribe(() => this.getPttswr());
    if (this.radio) {
      this.usb = this.radio.mode;
    }
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.currentUser.admin = false;
    }
  }

  ngOnDestroy() { 
    this.subscription.unsubscribe();
    console.log('quiting radio config');
  }
}
