import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { Subscription, interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { ApiService } from 'src/app/_services/api.service';
import { GPSService } from 'src/app/_services/gps.service';
import { UUCPService } from 'src/app/_services/uucp.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.less']
})

export class OperatorComponent implements OnInit {

  currentUser: User = null
  admin: boolean = false
  systemData: object
  loading: boolean = false
  error: Error
  poolSystemData: Subscription
  radio: any = []
  diskSpace: string = '0'
  gpsStatus: boolean
  activeSchedule: boolean = false
  queueSize: number = 0
  queueSizeB: number = 0


  constructor(
    private authenticationService: AuthenticationService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private gpsService: GPSService,
    private uucpService: UUCPService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public getSchedules(): void {
    this.loading = true
    this.apiService.getSchedules().subscribe(
      (res: any) => {

        var enabledSchedules = res.filter((a) => { return a.enable == 1 })

        if (enabledSchedules.length > 0)
          this.activeSchedule = true

        this.loading = false
      },
      (err) => {
        this.error = err;
        // this.errorAlert = true
        this.loading = false
      }
    );
  }

  getGPSStatus(): void {
    this.loading = true
    this.gpsService.getGPSStatus().subscribe(
      (res: any) => {
        if (res)
          this.gpsStatus = res

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getSystemStatus(): void {
    this.loading = true
    this.apiService.getStatus().subscribe(
      (res: any) => {

        this.diskSpace = (res.diskfree / 1024 / 1024).toFixed(3)
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  getQueue(): void {
    this.loading = true
    this.uucpService.getQueue().subscribe(
      res => {
        this.queueSize = res.length
        if (Object.keys(res).length > 0) {
          this.getQueueSizeB(res)
        }
        this.loading = false
      },
      (err) => {
        this.error = err
        this.loading = false
      }
    );
  }

  //Maybe go to utils?
  getQueueSizeB(queue) {
    if (queue && queue.length > 0) {
      for (let i = 0; i < Object.keys(queue).length; i++) {
        this.queueSizeB += parseInt(queue[i].size)
      }
    }
  }

  startBitrateGraph(): void {

    // https://www.amcharts.com/demos/area-with-time-based-data/

    var root = am5.Root.new("bitrateChart");

    // root.setThemes([
    //   am5themes_Animated.new(root)
    // ]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelY: "zoomX",
        layout: root.verticalLayout,
        pinchZoomX: true
      })
    );

    // Craete Y-axis
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
          pan: "zoom"
        })
      })
    );

    // Create X-Axis
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "millisecond", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 100,
          pan: "zoom",
          minorGridEnabled: true
        })
      })
    );

    let data = []; //this.getBitrateData()

    let visits = 0;
    for (var i = 0; i < 10000; i++) {
      // some random number
      visits = Math.round(Math.random() * (213 - 200) + 200);
      data.push({
        date: new Date().getMilliseconds(),
        visits: visits
      });
    }

    // Create series
    function createSeries(name, field, openField) {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "visits",
          valueXField: "date",
          openValueYField: openField,
          fill: am5.color("#f60"),
          stroke: am5.color("#f60")
        })
      );
      series.strokes.template.setAll({
        strokeWidth: 1.5
      });
      series.fills.template.setAll({
        fillOpacity: 0.3,
        visible: true
      });

      series.data.setAll(data);
    }

    createSeries("Series with breaks", "value", "openValue");


    let scrollbarX = am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 30
    });

    chart.set("scrollbarX", scrollbarX);

    let sbxAxis = scrollbarX.chart.xAxes.push(am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "millisecond", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        opposite: false,
        strokeOpacity: 0,
        minorGridEnabled: true,
        minGridDistance: 100
      })
    }));

    let sbyAxis = scrollbarX.chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));

    let sbseries = scrollbarX.chart.series.push(am5xy.LineSeries.new(root, {
      xAxis: sbxAxis,
      yAxis: sbyAxis,
      valueYField: "visits",
      valueXField: "date"
    }));

    sbseries.data.setAll(data);
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value

    this.getSchedules()
    this.getGPSStatus()
    this.getSystemStatus() //Disk free space
    this.getQueue()

    this.poolSystemData = interval(10000).subscribe((val) => {
      // this.getSystemData()
      this.getQueue() // TODO - needed?
    })

    this.startBitrateGraph()


    // Modem Status
    // Signal-to-noise ratio (SNR) --new
    // Bitrate --new
    // Successful Transmission --new
    // Re-transmissions count
    //

    // ONE API CALL
    // Remote Devices --new
  }
}
