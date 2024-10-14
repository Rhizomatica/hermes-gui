import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { Subscription, interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { ApiService } from 'src/app/_services/api.service';
import { GPSService } from 'src/app/_services/gps.service';
import { UUCPService } from 'src/app/_services/uucp.service';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
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
  bitrateData: any = []
  snrData: any = []
  axis1 = null
  axis2 = null
  hand1 = null
  hand2 = null


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

  startGaugeChart() {

    var root = am5.Root.new("swrChart");

    // root.setThemes([
    //   am5themes_Animated.new(root)
    // ]);

    var chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        radius: am5.percent(95),
        innerRadius: -20
      })
    );

    this.axis1 = this.createAxis(0, 300, -180, -95, am5.color('#f60'), 'forward',chart, root);
    this.axis2 = this.createAxis(0, 100, -85, 0, am5.color('#FF9955'), 'reflected',chart, root);


    
    var hand1 = this.createHand(this.axis1, root);
    var hand2 = this.createHand(this.axis2, root);

    this.loadGaugData()

  }

  createAxis(min, max, start, end, color, label, chart, root) {
    var axisRenderer = am5radar.AxisRendererCircular.new(root, {
      strokeOpacity: 0.1,
      minGridDistance: 30,
      startAngle: start,
      endAngle: end,
      stroke: color
    });

    axisRenderer.ticks.template.setAll({
      visible: true,
      strokeOpacity: 0.8,
      stroke: color
    });

    axisRenderer.grid.template.setAll({
      visible: false
    });

    var axis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: min,
        max: max,
        strictMinMax: true,
        renderer: axisRenderer
      })
    );

    var rangeDataItem = axis.makeDataItem({
      value: min,
      endValue: max
    });

    var range = axis.createAxisRange(rangeDataItem);

    rangeDataItem.get("axisFill").setAll({
      visible: true,
      fill: color,
      fillOpacity: 0.8,
      stroke: color,
      strokeOpacity: 0.8,
      strokeWidth: 1
    });

    rangeDataItem.get("tick").setAll({
      visible: false
    });

    rangeDataItem.get("label").setAll({
      text: label,
      inside: true,
      radius: 5,
      fontSize: "0.9em",
    });

    return axis;
  }

  createHand(axis, root) {
    var color = axis.get("renderer").get("stroke");
    var handDataItem = axis.makeDataItem({
      value: 0
    });

    var hand = handDataItem.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: am5radar.ClockHand.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(70)
      })
    }));

    hand.get("sprite").pin.setAll({
      forceHidden: true
    });

    hand.get("sprite").hand.setAll({
      fill: color,
      fillOpacity: 0.9
    });

    axis.createAxisRange(handDataItem);

    return hand;
  }

  loadGaugData(){
    var one = this.hand1

    one.get("sprite").dataItem.animate({
      key: "value",
      to: Math.random() * one.axis.get("max"),
      duration: 800,
      easing: am5.ease.out(am5.ease.cubic)
    });

    var two = this.hand2

    two.get("sprite").dataItem.animate({
      key: "value",
      to: Math.random() * this.hand2.axis.get("max"),
      duration: 800,
      easing: am5.ease.out(am5.ease.cubic)
    });
    
  };

  // createRange(start, end, color, label, axis){
  //   var rangeDataItem = axis.makeDataItem({
  //     value: start,
  //     endValue: end
  //   });
  
  //   var range = axis.createAxisRange(rangeDataItem);
    
  //   rangeDataItem.get("axisFill").setAll({
  //     visible: true,
  //     fill: color,
  //     fillOpacity: 0.8
  //   });
    
  //   rangeDataItem.get("tick").setAll({
  //     visible: false
  //   });
    
  //   rangeDataItem.get("label").setAll({
  //     text: label,
  //     inside: true,
  //     radius: 8,
  //     fontSize: "0.9em",
  //     fill: am5.color(0xffffff)
  //   });
  // }

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

    this.startGaugeChart()

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
