import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less']
})
export class RadioConfigComponent implements OnInit {

  alterFreq: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeFreq() {
    if (this.alterFreq == false) {
      this.alterFreq = true; 
    } else {
      this.alterFreq = false;
    }
  }

}
