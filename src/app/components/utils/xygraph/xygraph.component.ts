import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

@Component({
  selector: 'xygraph',
  templateUrl: './xygraph.component.html',
  styleUrls: ['./xygraph.component.less']
})


export class XYGraphComponent implements OnChanges {

  constructor() {
    this.graphElementID = null
    this.graphData = null
  }

  @Input() graphElementID: string
  @Input() graphData: []

  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  ngOnChanges(change) {
    change && change.graphElementID.currentValue != change.graphElementID.previousValue ? this.graphElementID = change.graphElementID.currentValue : null
  }

  startXYGraph(): void {
    var elementID = this.graphElementID
    var data = this.graphData

    var root = am5.Root.new(elementID);

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

  ngAfterViewInit() {
    this.startXYGraph()
  }
}