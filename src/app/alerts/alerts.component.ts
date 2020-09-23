import { Component, OnInit } from '@angular/core';
import { AlertService } from "../alert.service";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.less']
})
export class AlertsComponent implements OnInit {

  constructor(public alertService: AlertService) { }

  ngOnInit(): void {
  }

}
