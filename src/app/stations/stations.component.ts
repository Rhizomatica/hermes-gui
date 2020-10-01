import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, NgModule } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { Station } from '../station';
import { StationService } from '../station.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.less']
})
export class StationsComponent implements OnInit {
  error = '';
  success = '';
  test = '';
  stations: Station[];

  constructor(private stationService: StationService) { }
  getStations(): void {
    this.stationService.getStations().subscribe(
      (res: any) => {
        this.stations = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }


  ngOnInit(): void {
    this.getStations();
  }
}
