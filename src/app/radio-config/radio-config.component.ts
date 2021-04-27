import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
//import { Router } from '@angular/router';
//import { GlobalConstants } from '../global-constants';

// import { NgForm} from '@angular/forms';

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

  changeFreq() {
    if (this.alterFreq == false) {
      this.alterFreq = true; 
    } else {
      this.alterFreq = false;
    }
  }

  ngOnInit(): void {
     this.radio=this.getRadioStatus();
     console.log(this.teste);
  }

}
