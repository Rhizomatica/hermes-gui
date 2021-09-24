import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { RadioService } from '../_services/radio.service';
import { NgForm } from '@angular/forms';
import {DecimalPipe} from '@angular/common';
//import { truncateSync } from 'fs';


//import { Router } from '@angular/router';
//import { GlobalConstants } from '../global-constants';


@Component({
  selector: 'app-testradio',
  templateUrl: './testradio.component.html',
  styleUrls: ['./testradio.component.less'],
  providers: [DecimalPipe],

})

export class TestradioComponent implements OnInit {
  public radio: any = [];
  error: Error;
  alterFreq: boolean = false;
  alterSet: boolean = false;
  confirmSet: boolean = false;
  res: any;
  ptt: any;
  bfo: any;
  mastercal: any;
  freq: any;
  reseting: boolean = false;
  usb: boolean = true;
  mode: any;
  led: any;
  protection: any;
  bypass: any;
  public realValue : number;
  public freqmin = 500000;
  public freqmax =30000000;
  errorAlert: boolean = false;
  radioError: boolean = false;
  testtone= '0';
  toneOn: boolean = false;

  constructor    ( 
	private apiService: ApiService,
	private radioService: RadioService,
	private decimalPipe: DecimalPipe) { }

  getRadioStatus(): void{
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio = res;
        this.radio.extra=false;
        this.bfo = this.radio.bfo;
        this.mastercal = this.radio.mastercal;
        this.freq = this.radio.freq;
        this.mode = this.radio.mode;
        this.led = this.radio.led;
        this.protection = this.radio.protection;
        this.bypass = this.radio.bypass;

        if (this.radio.bypass=='ON') {
          this.bypass = true;
        } else {
          this.bypass = false;
        }
		this.ptt = 'OFF';
        //console.log('hahah' + this.ptt);

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
  set value(newValue : number) {
    this.realValue = newValue;
    if(this.realValue < this.freqmin){
      this.realValue = undefined;
      setTimeout(() => {this.realValue = this.freqmin;});
    }
    else if(this.realValue > this.freqmax){
      this.realValue = undefined;
      setTimeout(() => {this.realValue = this.freqmax;});
    }
  }

  changeCallback(f:NgForm){
    
  }

  changePtt(f){
	  console.log (f);
    
    this.radioService.setRadioPTT(f).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config - set ptt- : res: ', res);
        console.log (this.ptt);
        this.radio.ptt = res;
        this.ptt = f;
                // this.fileIsProcessing = true;
      },
      (err) => {
       this.error = err;
        this.errorAlert = true;
      }
    )
  }


  testTone(f) {

    this.testtone = f;

    console.log(f);
    console.log(this.toneOn);

    if (f == '0') {
      this.toneOn = false;

    } else {
      this.toneOn = true;
    }

    this.radioService.setRadioTone(f).subscribe(
      (res: any) => {
        this.res = res;
		this.radio.refthreshold = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )


  }

  changeRefThreshold(f:NgForm){
    this.radioService.setRadioRefThreshold(f.value.refthreshold).subscribe(
      (res: any) => {
        this.res = res;
        //console.log('⚚ radio config - set bypass- : res: ', res);
		this.radio.refthreshold = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
  }

  confirmReset() {
    if (this.reseting) {
      this.reseting = false;
    } else {
      this.reseting = true;
    }
    //console.log('⚚ radio-config - confirmReset: ', this.reseting);

  }

  resetRadio() {
    console.log('⚚ radio-config - reset to defaults ');
  }

  screenFreq():void {
    if (this.alterFreq == false) {
      this.alterFreq = true; 
    } else {
      this.alterFreq = false;
    }
  }

  changeRadioFreqMode(f:NgForm){
    this.radioService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error =  err;
        this.errorAlert = true;
      }
    )

    this.radioService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeFreqMode- setRadioMode: res: ', res);
        console.log('⚚ changeFreqMode- setRadioMode: res: ', res);
        window.location.reload();

        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error =  err;
        this.errorAlert = true;
      }
    )

  }

  changeFrequency(f:NgForm) {
    this.radioService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        this.radio.freq = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
    //filter if is number
    //filter range 
  }

  changeMode(f:NgForm) {
    this.radioService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeFreqMode-: res: ', res);
        this.radio.mode = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error =  err;
        this.errorAlert = true;
      }
    )

  }

  changeBfo(f:NgForm){
    this.radioService.setRadioBfo(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeBfo- setRadioBfo: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
  }

  changeMasterCall(f:NgForm){
    this.radioService.setRadioMastercal(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeMastercall- setRadioMastercal: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
  }

  changeByPass(f){
    this.radioService.setRadioBypass(f).subscribe(
      (res: any) => {
        this.res = res;

        if (this.radio.bypass=="ON") {
          this.bypass = true;
        } else {
          this.bypass = false;
        }
        console.log('⚚ radio config - set bypass- : res: ', res);
        console.log('⚚ radio config - set radio bypass- :' ,this.radio.bypass)
        console.log('⚚ radio config - set bypass- :' ,this.bypass)

        this.bypass = res;
		this.radio.bypass = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
  }

resetProtection(f:NgForm) {
  this.radioService.radioReset().subscribe(
	  (res: any) => {
		this.res = res;
		console.log('⚚ radio config - reset radio: res: ', res);
		// this.fileIsProcessing = true;
	  },
	  (err) => {
		this.error = err;
		this.errorAlert = true;
	  }
	)

}



  confirmChange(){
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
  }

  screenSet() {
    if (this.alterSet == false) {
      this.alterSet = true; 
    } else {
      this.alterSet = false;
    }
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }

  }



  changeRadioSettings(f:NgForm){
    
    this.radioService.setRadioBfo(f.value.bfo).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config changeRadioSettings - Bfo: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )

    this.radioService.setRadioMastercal(f.value.mastercal).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config changeRadioSettings - mastercal: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error =  err;
        this.errorAlert = true;
      }
    )
  }

  closeError() {
    this.errorAlert = false;
  }


  submitSet() {
    if (this.confirmSet == false) {
      this.confirmSet = true; 
    } else {
      this.confirmSet = false;
    }
  }

  ngOnInit(): void {

    this.radio=this.getRadioStatus();

    if (this.radio.mode=="USB") {
      this.usb = true;
    } else {
      this.usb = false;
    }

    if (this.radio) {
      this.usb= this.radio.mode;
    }
     //console.log(this.usb)
  }

}
