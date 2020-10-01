import { Component, OnInit } from '@angular/core';
import { StationsComponent } from '../stations/stations.component';
import { MessagesComponent } from '../messages/messages.component';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-sysadmin',
  templateUrl: './sysadmin.component.html',
  styleUrls: ['./sysadmin.component.less']
})
export class SysadminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
