import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';
import { GlobalConstants } from 'src/app/global-constants';
import { NgForm } from '@angular/forms';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
// import am5geodata_worldHigh from "../../../../assets/maps/worldHigh.js";
import am5geodata_bangladeshHigh from "../../../../assets/maps/bangladeshHigh";
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
  interval: number = 0
  range: number = 0
  email: string = null
  currentLatitude: number = null
  currentLongitude: number = null
  // currentLatitude: number = 21.732970
  // currentLongitude: number = 89.882957
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
    // this.loading = true
    this.gpsService.getStoredGPSFiles().subscribe(
      (res: any) => {
        if (res)
          this.files = res

        // this.loading = false
      },
      (err) => {
        this.error = err;
        // this.loading = false
      }
    );
  }

  getGPSStatus(): void {
    // this.loading = true
    this.gpsService.getGPSStatus().subscribe(
      (res: any) => {
        if (res)
          this.status = res

        // this.loading = false
      },
      (err) => {
        this.error = err;
        // this.loading = false
      }
    );
  }

  getInterval() {
    // this.loading = true
    this.gpsService.getInterval().subscribe(
      (res: any) => {
        if (res)
          this.interval = res

        // this.loading = false
      },
      (err) => {
        this.error = err;
        // this.loading = false
      }
    );
  }

  getFileRangeTime() {
    // this.loading = true
    this.gpsService.getFileRangeTime().subscribe(
      (res: any) => {
        if (res)
          this.range = parseInt(res) / 60

        // this.loading = false
      },
      (err) => {
        this.error = err;
        // this.loading = false
      }
    );
  }

  getEmail() {
    // this.loading = true
    this.gpsService.getEmail().subscribe(
      (res: any) => {
        if (res)
          this.email = res

        // this.loading = false
      },
      (err) => {
        this.error = err;
        // this.loading = false
      }
    );
  }

  getCurrentCoordinates() {
    
    if(!this.currentLatitude && !this.currentLongitude)
      this.loading = true
    
    this.gpsService.getCurrentCoordinates().subscribe(
      (res: any) => {
        if (res && res.latitude !== null && res.longitude !== null) {
          this.currentLatitude = res.latitude
          this.currentLongitude = res.longitude

          this.pointSeries.data.setAll([{
            lat: this.currentLatitude,
            long: this.currentLongitude,
            name: "Current Location"
          }]);
        }

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  startMap() {
    var latitude = this.currentLatitude
    var longitude = this.currentLongitude

    //Chart
    let root = am5.Root.new("chartmap");
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoMercator(),
        focusable: true
      })
    );

    chart.chartContainer.set("background", am5.Rectangle.new(root, {
      fill: am5.color("#90daee"),
      stroke: am5.color("#f60"),
      strokeWidth: 2.5
    }));

    const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    zoomControl.minusButton.setAll({
      background: am5.Rectangle.new(root, {
        fill: am5.color("#f60"),
        fillOpacity: 0.6
      })
    });

    zoomControl.plusButton.setAll({
      background: am5.Rectangle.new(root, {
        fill: am5.color("#f60"),
        fillOpacity: 0.6
      })
    });


    let homeButton = chart.children.push(am5.Button.new(root, {
      paddingTop: 10,
      paddingBottom: 10,
      marginRight: 10,
      marginTop: 10,
      x: am5.percent(99.2),
      y: am5.percent(2.3),
      centerX: am5.percent(100),
      opacity: 0,
      interactiveChildren: false,
      background: am5.Rectangle.new(root, {
        fill: am5.color("#f60"),
        fillOpacity: 0.8
      }),
      icon: am5.Graphics.new(root, {
        svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
        fill: am5.color("#fff")
      })
    }));

    homeButton.show();

    homeButton.events.on("click", function () {
      chart.goHome();
      // chart.zoomToGeoPoint({
      //   longitude: longitude,
      //   latitude: latitude
      // }, 15);
    });

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
      fill: am5.color("#f5f3f3")
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#f60")
    });

    polygonSeries.events.on("datavalidated", function () {
      chart.zoomToGeoPoint({
        longitude: longitude,
        latitude: latitude
      }, 15);
    });

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

    //For testing a fake spot*****
    // this.pointSeries.data.setAll([{
    //   lat: this.currentLatitude,
    //   long: this.currentLongitude,
    //   name: "Current Location"
    // }]);
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

    if (f.value.range) {
      f.value.range = parseInt(f.value.range) * 60
    }

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
    if (this.confirmSOS)
      return this.confirmSOS = false


    if (!this.confirmSOS)
      return this.confirmSOS = true
  }

  confirmSOSEmergency() {
    this.confirmSOS = false
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
    this.loading = true
    this.getGPSFiles()
    this.getGPSStatus()
    this.getInterval()
    this.getFileRangeTime()
    this.getEmail()
    this.getCurrentCoordinates() //First call
    this.startMap()

    //Pool current coordinates
    this.poolCoordinates = interval(10000).subscribe((val) => {
      this.getCurrentCoordinates()
    });

  }

  ngOnDestroy() {
    if (this.poolCoordinates)
      this.poolCoordinates.unsubscribe()
  }
}
