import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit {

  uLog: boolean = false;
  eLog: boolean = false

  constructor() {
  }

  showUucpLog() {
    this.uLog = true;
    this.eLog = false;
  }

  showEmailLog() {
    this.uLog = false;
    this.eLog = true;
  }


  closeLogs() {
    this.uLog = false;
    this.eLog = false;
  }

getLogs() {
  console.log('logs');
}


  ngOnInit(): void {
    this.getLogs();
  }

}
