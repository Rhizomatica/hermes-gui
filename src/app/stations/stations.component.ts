import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Station } from '../station';
import { StationService } from "../station.service";




@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.less']
})
export class StationsComponent implements OnInit {

  station: Station = {
    id: 1,
    name: 'Una',
    location: 'Alto do Xingú'
  };

 

  constructor() { }

  ngOnInit(): void {
  }

}
