import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from "@amcharts/amcharts5/xy";

@Component({
  selector: 'clockhandgraph',
  templateUrl: './clockhandgraph.component.html',
  styleUrls: ['./clockhandgraph.component.less']
})


export class ClockHandGraphComponent implements OnChanges {

  constructor() {
    this.graphElementID = null
    this.hand1Data = null
    this.hand2Data = null
    this.hand1Label = null
    this.hand2Label = null
    this.axis1 = null
    this.axis2 = null
    this.hand1 = null
    this.hand2 = null
  }

  @Input() graphElementID: string
  @Input() hand1Data: number
  @Input() hand2Data: number
  @Input() hand1Label: string
  @Input() hand2Label: string

  axis1: []
  axis2: []
  hand1: any
  hand2: any

  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  ngOnChanges(change) {
    if (change && change.hand1Data.currentValue != change.hand1Data.previousValue) {
      
      this.hand1Data = change.hand1Data.currentValue

      if(!this.hand1)
        return 

      this.hand1.get("sprite").dataItem.animate({
        key: "value",
        to: change.hand1Data.currentValue,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }

    if (change && change.hand2Data.currentValue != change.hand2Data.previousValue) {
      
      this.hand2Data = change.hand2Data.currentValue

      if(!this.hand2)
        return 

      this.hand2.get("sprite").dataItem.animate({
        key: "value",
        to: change.hand2Data.currentValue,
        duration: 800,
        easing: am5.ease.out(am5.ease.cubic)
      });
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
        innerRadius: -28
      })
    );

    this.axis1 = this.createAxis(0, 300, -180, -95, am5.color('#f60'), this.hand1Label, chart, root);
    this.axis2 = this.createAxis(0, 100, -85, 0, am5.color('#FF9955'), this.hand2Label, chart, root);

    this.hand1 = this.createHand(this.axis1, this.hand1Data, root);
    this.hand2 = this.createHand(this.axis2, this.hand2Data, root);
    console.log(this.hand1)
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

  createHand(axis, data, root) {

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

    hand.get("sprite").dataItem.animate({
      key: "value",
      to: data,
      duration: 800,
      easing: am5.ease.out(am5.ease.cubic)
    });

    return hand;
  }

  ngAfterViewInit() {
    this.startGaugeChart()
  }
}