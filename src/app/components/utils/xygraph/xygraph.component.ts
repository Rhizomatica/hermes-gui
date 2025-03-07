import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { SharedService } from 'src/app/_services/shared.service';
@Component({
  selector: 'xygraph',
  templateUrl: './xygraph.component.html',
  styleUrls: ['./xygraph.component.less']
})


export class XYGraphComponent implements OnChanges {

  constructor(
    sharedService: SharedService
  ) {
    this.graphElementID = null
    this.graphData = null
    this.series = null
    this.dataLength = null
    this.xAxis = null
    this.chart = null
    this.sharedService = sharedService
  }

  @Input() graphElementID: string
  @Input() graphData: []
  @Input() dataLength: number

  series: any
  xAxis: any
  chart: any
  sharedService: SharedService
  poolSystemData: Subscription
  

  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  ngOnChanges(change) {
    change && change.graphElementID && change.graphElementID.currentValue != change.graphElementID.previousValue ? this.graphElementID = change.graphElementID.currentValue : null

    change && change.graphData && change.graphData.currentValue != change.graphData.previousValue ? this.graphData = change.graphData.currentValue : null

    change && change.dataLength && change.dataLength.currentValue != change.dataLength.previousValue ? this.dataLength = change.dataLength.currentValue : null

    this.addData()
  }

  startXYGraph(): void {
    var elementID = this.graphElementID

    // https://www.amcharts.com/demos/area-with-time-based-data/

    var root = am5.Root.new(elementID);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    this.chart = root.container.children.push(am5xy.XYChart.new(root, {
      focusable: true,
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX"
    }));

    let chart = this.chart

    let easing = am5.ease.linear;

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    this.xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.5,
      extraMin: -0.1,
      extraMax: 0.1,
      groupData: false,
      visible: false,
      baseInterval: {
        timeUnit: "second",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
        minGridDistance: 100
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    var xAxis = this.xAxis

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    this.series = chart.series.push(am5xy.LineSeries.new(root, {
      minBulletDistance: 10,
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      stroke: am5.color("#f60"),
      fill: am5.color("#f60"),
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{valueY}"
      })
    }));

    this.series.data.setAll(this.graphData);

    this.series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: undefined,
        sprite: am5.Circle.new(root, {
          radius: 4,
          stroke: am5.color("#f60"),
          fill: am5.color("#f60")
        })
      })
    });


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      xAxis: xAxis
    }));

    cursor.lineY.set("visible", false)

    this.series.data.push(this.graphData)
  }

  addData() {

    if (!this.series)
      return

    let lastValue = this.graphData[this.graphData.length - 2]['value']
    let lastDate = this.graphData[this.graphData.length - 2]['date']
    // let lastDataItem = this.series.dataItems[this.series.dataItems.length - 1];
    // let lastValue = lastDataItem.get("valueY");
    // let lastDate = new Date(lastDataItem.get("valueX"));

    let newValue = this.graphData[this.graphData.length - 1]['value']

    let time = am5.time.add(new Date(lastDate), "second", 1).getTime()

    this.series.data.removeIndex(0);
    
    this.series.data.push({
      date: time,
      value: newValue
    })

    let newDataItem = this.series.dataItems[this.series.dataItems.length - 1]

    newDataItem.animate({
      key: "valueYWorking",
      to: newValue,
      from: lastValue,
      duration: 600,
      easing: am5.ease.linear
    });

    let animation = newDataItem.animate({
      key: "locationX",
      to: 0.5,
      from: -0.5,
      duration: 600
    });

    if (animation) {
      let xAxis = this.xAxis
      let tooltip = this.xAxis.get("tooltip");
      if (tooltip && !tooltip.isHidden()) {
        animation.events.on("stopped", function () {
          xAxis.updateTooltip();
        })
      }
    }
  }

  ngAfterViewInit() {

    this.startXYGraph()

    // this.poolSystemData = interval(10000).subscribe((val) => {
    //   this.addData()
    // })

  }

  ngOnDestroy(){
    // this.chart.clear()
    if(this && this.chart){
      this.chart.dispose();
      this.chart = null
      this.sharedService.storedRadioObj.bitrateHistory = []
      this.sharedService.storedRadioObj.snrHistory = []
    }
  }
  // https://www.amcharts.com/demos/live-data/
}