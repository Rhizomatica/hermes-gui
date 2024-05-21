import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';
import { NgForm } from '@angular/forms';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_bangladeshHigh from "../../../../assets/maps/bangladeshHigh.js";
import { Subscription, interval } from 'rxjs';

// import { PolylineSeries } from '@amcharts/amcharts5/.internal/charts/stock/drawing/PolylineSeries';

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
  email: string = null
  currentLatitude: number = null
  currentLongitude: number = null
  status: boolean = false
  urlDownloadFile: string = `${GlobalConstants.apiURL}/geolocation/file`
  urlDownloadAll: string = `${GlobalConstants.apiURL}/geolocation/files/all`
  pointSeries = null
  deleteConfirmation = false
  poolCoordinates: Subscription
  confirmSOS: boolean = false

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
          this.status = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getInterval() {
    this.loading = true
    this.gpsService.getInterval().subscribe(
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

  getFileRangeTime() {
    this.loading = true
    this.gpsService.getFileRangeTime().subscribe(
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

  getEmail() {
    this.loading = true
    this.gpsService.getEmail().subscribe(
      (res: any) => {
        if (res)
          this.email = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getCurrentCoordinates() {
    this.gpsService.getCurrentCoordinates().subscribe(
      (res: any) => {
        if (res && res.latitude !== null && res.longitude !== null) {
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude

          //TODO - Rever regra... (pulling inicializacao e atualizacao)
          //update map
          // this.pointSeries.pushDataItem({ latitude: 51.470020, longitude: -0.454296 });

          //Mapa deve andar junto com a localizacao? Focus?
          this.pointSeries.data.setAll([{
            lat: this.currentLatitude,
            long: this.currentLongitude,
            name: "Current Location"
          }]);
        }
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  startMap() {

    //Chart
    let root = am5.Root.new("chartmap");
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoMercator(),
        focusable: true
      })
    );

    //TODO - Style for zoomControl
    // chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    chart.chartContainer.set("background", am5.Rectangle.new(root, {
      fill: am5.color("#90daee"),
      stroke: am5.color("#f60"),
      strokeWidth: 2.5
    }));

    //TODO - start map focused
    // chart.zoomToGeoPoint({
    //   longitude: this.currentLongitude, latitude: this.currentLatitude
    // }, 1.5, true);

    //End chart

    // Graticule Series
    let graticuleSeries = chart.series.unshift(
      am5map.GraticuleSeries.new(root, {
        step: 1
      })
    );

    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x000000),
      strokeOpacity: 0.1,
    });

    // PolygonSeries
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_bangladeshHigh
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      stroke: am5.color("#90daee"),
      strokeWidth: 0.5,
      fill: am5.color("#f5f3f3"),
      tooltipText: "{name}",
      interactive: true
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#f60")
    });

    // TODO - Zoom clicked item
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/
    // polygonSeries.mapPolygons.template.events.on("click", function(ev) {
    //   polygonSeries.zoomToDataItem(ev.target.dataItem);
    // });

    //Point Series
    this.pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {
      latitudeField: "lat",
      longitudeField: "long",
      position: "absolute",
      polygonIdField: "polygonId"
    }));

    this.pointSeries.bullets.push(function () {
      var circle = am5.Circle.new(root, {
        radius: 4,
        fill: am5.color("#f60"),
        tooltipText: "{name}"
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });
  }

  updateGPSInterval(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSInterval(f.value.interval).subscribe(
      (res: any) => {
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateFileRangeTime(f: NgForm) {
    this.loading = true
    this.gpsService.updateFileRangeTime(f.value.range).subscribe(
      (res: any) => {
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  updateGPSEmail(f: NgForm) {
    this.loading = true
    this.gpsService.updateGPSEmail(f.value.email).subscribe(
      (res: any) => {
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
        return null
      },
      (err) => {
        this.error = err;
      }
    );
  }

  deleteAllStoredFiles() {
    if (!this.deleteConfirmation)
      return this.deleteConfirmation = true


    if (this.deleteConfirmation)
      return this.deleteConfirmation = false
  }

  confirmDeleteAllStoredFiles() {
    this.deleteConfirmation = false
    this.loading = true
    this.gpsService.deleteAllStoredFiles().subscribe(
      (res: any) => {
        if (res)
          this.getGPSFiles()
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  SOSEmergency() {
    if(this.confirmSOS)
      return this.confirmSOS = false
    

    if(!this.confirmSOS)
      return this.confirmSOS = true
  }

  confirmSOSEmergency(){
    this.loading = true
    this.gpsService.SOSEmergency().subscribe(
      (res: any) => {
        if (res)
          this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.getGPSFiles()
    this.getGPSStatus()
    this.getInterval()
    this.getFileRangeTime()
    this.getEmail()
    this.getCurrentCoordinates() //First call

    //Pool current coordinates
    this.poolCoordinates = interval(10000).subscribe((val) => {
      this.getCurrentCoordinates()
    });

    this.startMap()
  }

  ngOnDestroy() {
    if (this.poolCoordinates)
      this.poolCoordinates.unsubscribe()
  }
}
