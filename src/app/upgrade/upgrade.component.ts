import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.less']
})
export class UpgradeComponent implements OnInit {

restore: boolean = false;
restoreConf: boolean = false;

  restoreAlert() {
  this.restore =true;
  }

  restoreConfirm() {
    this.restoreConf = true;
    this.restore = false;
  }

  cancelRestore() {
    this.restore = false;
    this.restoreConf = false;
  }


  constructor() { }

  ngOnInit(): void {
  }

}
