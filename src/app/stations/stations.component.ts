import { Component, OnInit } from '@angular/core';

import { Station } from '../station';




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
