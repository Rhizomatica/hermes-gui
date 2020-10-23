import { Component, OnInit } from '@angular/core';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { Observable, of, throwError } from 'rxjs';

import { Station } from '../station';
import { StationsComponent } from '../stations/stations.component';
import { StationService } from '../station.service';


@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})
export class MessagecomposeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
