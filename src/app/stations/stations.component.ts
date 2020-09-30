import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Station } from '../station';
import { StationService } from "../station.service";
//import { map, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.less']
})
export class StationsComponent implements OnInit {

  station:Station[];
  error='';
  success='';
  //TODO
  stationsample: Station = {
    id: 1,
    name: 'Una',
    location: 'Alto do Xingú'
  };

  //stations:Station[];
  constructor(private stationService: StationService) {}
           
  getStations(): void {
    this.stationService.getAll().subscribe(
      (res: Station[]) => {
        this.station = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

//constructor() { }

  ngOnInit() {
    this.getStations();
  }
}
