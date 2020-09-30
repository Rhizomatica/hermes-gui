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

  error='';
  success='';
  //TODO
  /*station: Station = {
    id: 1,
    name: 'Una',
    location: 'Alto do Xingú'
  };*/
  
 station:Station[];
  
  constructor(private stationService: StationService) { }             
  getStations(): void {
    this.stationService.getStations().subscribe(
      (res: Station[]) => {
        //forcing on element 0 of array 
        this.station = res[0];
        console.log("debugger station.component")
        console.log(this.station);
        
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit() {
    this.getStations();
  }
}
