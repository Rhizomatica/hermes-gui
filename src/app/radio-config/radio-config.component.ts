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

  constructor    ( private apiService: ApiService) { }

  getRadioStatus(): void{
    this.apiService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio= res;
        this.radio.extra=false;
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
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


  screenSet() {
    if (this.alterSet == false) {
      this.alterSet = true; 
    } else {
      this.alterSet = false;
    }
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
  }

}
