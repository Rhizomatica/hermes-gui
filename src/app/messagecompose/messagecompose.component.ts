import { Component, OnInit } from '@angular/core';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { Observable, of, throwError } from 'rxjs';

import { Station } from '../station';
import { StationService } from '../station.service';
//import { StationsComponent } from '../stations/stations.component';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {
  stations: Station[];
  constructor(private stationService: StationService) {}

  ngOnInit(): void {
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations)
  }

}
