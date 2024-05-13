import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';
import { NgForm } from '@angular/forms';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_bangladeshHigh from "../../../../assets/maps/bangladeshHigh.js";

export interface LogList {
  line: string;
  content: string;
}

@Component({
  selector: 'gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.less']
})

export class GPSComponent implements OnInit, OnDestroy {

  currentUser: User
  admin: boolean = false
  error = Error
  errorAlert = false
  loading = false
  files: string[]
  interval: number = 120
  range: number = 3600
  currentLatitude: number = null
  currentLongitude: number = null
  status: boolean = false
  urlDownloadFile: string = `${GlobalConstants.apiURL}/geolocation/file`
  urlDownloadAll: string = `${GlobalConstants.apiURL}/geolocation/files/all`

  constructor(private authenticationService: AuthenticationService,
    private gpsService: GPSService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
      if (this.currentUser)
        this.admin = this.currentUser.admin
    });
  }

  getGPSFiles(): void {
    this.loading = true
    this.gpsService.getStoredGPSFiles().subscribe(
      (res: any) => {
        if (res)
          this.files = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getGPSStatus(): void {
    this.loading = true
    this.gpsService.getGPSStatus().subscribe(
      (res: any) => {
        if (res)
          this.status = res.status

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getCurrentCoordinates() {
    this.loading = true
    this.gpsService.getCurrentCoordinates().subscribe(
      (res: any) => {
        if (res) {
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude
        }

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateGPSInterval(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSInterval(f.value.interval).subscribe(
      (res: any) => {
        if (res)
          this.interval = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateGPSFileRange(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSFileRange(f.value.range).subscribe(
      (res: any) => {
        if (res)
          this.range = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  toggleGPS(f: NgForm) {

    if (this.status) {
      this.status = false
    }
    else if (!this.status) {
      this.status = true
    }

    this.gpsService.toggleGPS(this.status).subscribe(
      (res: any) => {
        if (res)
          this.status = res
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  deleteAllStoredFiles() {
    this.loading = true
    this.gpsService.deleteAllStoredFiles().subscribe(
      (res: any) => {
        if (res)
          this.getGPSFiles()
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }


  startMap() {
    let root = am5.Root.new("chartmap");
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoEqualEarth(),
        panX: "rotateX",
        panY: "rotateY"
      })
    );

    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_bangladeshHigh
      })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

  }

  ngOnInit(): void {
    this.getGPSFiles()
    this.getGPSStatus()
    this.getCurrentCoordinates()
    this.startMap()
  }

  ngOnDestroy() {
  }

}


