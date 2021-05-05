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
  teste = "teste";
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

  changeFreq(f: NgForm):void {
    if (this.alterFreq == false) {
      this.alterFreq = true; 
    } else {
      this.alterFreq = false;
    }
    console.log("test", f.value);
    return;

    this.apiService.setRadioFreq(f.value.freq).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ messagecompose - sendMessage: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
      }
    )

  }


  changeSet() {
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
