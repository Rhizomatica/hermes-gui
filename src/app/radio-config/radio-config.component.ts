import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { NgForm } from '@angular/forms';
//import { Router } from '@angular/router';
//import { GlobalConstants } from '../global-constants';


@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less']
})
export class RadioConfigComponent implements OnInit {
  radio: any;
  error: any;
  alterFreq: boolean = false;
  alterSet: boolean = false;
  confirmSet: boolean = false;
  res: any;
  bfo: any;
  mastercal: any;
  freq: any;
  reseting: boolean = false;
  usb: boolean = true;

  constructor    ( private apiService: ApiService) { }

  getRadioStatus(): void{
    this.apiService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio= res;
        this.radio.extra=false;
        this.bfo = this.radio.bfo;
        this.mastercal = this.radio.mastercal;
        this.freq = this.radio.freq;
        return res;
        
      },
      (err) => {
        this.error = err;
      }
    );
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
    this.apiService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = "alo" + err;
      }
    )

    this.apiService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeFreqMode- setRadioMode: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = '⚚ changeFreqMode-' +  err;
      }
    )

  }

  changeFrequency(f:NgForm) {
    this.apiService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeRadio- setRadioFreq: res: ', res);
        this.radio.freq = res;
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = "alo" + err;
      }
    )

    //filter if is number
    //filter range 

  }

  changeMode(f:NgForm) {
    this.apiService.setRadioMode(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeFreqMode- setRadioMode: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = '⚚ changeFreqMode-' +  err;
      }
    )

  }

  changeBfo(f:NgForm){
    this.apiService.setRadioBfo(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeBfo- setRadioBfo: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = '⚚ changeBfo-' +  err;
      }
    )
  }

  changeMasterCall(f:NgForm){
    this.apiService.setRadioMastercal(f.value.mode).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ changeMastercall- setRadioMastercal: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = '⚚ setRadioMastercal-' +  err;
      }
    )
  }

  confirmChange(){
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
console.log(this.confirmSet)
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
    console.log(this.alterSet)

  }



  changeRadioSettings(f:NgForm){
    
    
    this.apiService.setRadioBfo(f.value.bfo).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config changeRadioSettings - Bfo: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = "changebfo" + err;
      }
    )

    this.apiService.setRadioMastercal(f.value.mastercal).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ radio config changeRadioSettings - mastercal: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = '⚚ changemastercal-' +  err;
      }
    )

  }


  changeFreq() {

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


     this.usb= this.radio.mode;
     console.log(this.usb)
  }

}
