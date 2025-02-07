import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/global-constants';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_bangladeshHigh from "../../../../assets/maps/bangladeshHigh";

@Component({
  selector: 'mapgraph',
  templateUrl: './mapgraph.component.html',
  styleUrls: ['./mapgraph.component.less']
})

export class MapGraphComponent implements OnChanges, OnInit {

  constructor() {
    this.currentLatitude = 0
    this.currentLongitude = 0
    this.pointSeries = null
    this.polygonSeries = null
    this.chart = null
  }

  @Input() currentLatitude: number
  @Input() currentLongitude: number

  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  pointSeries: any
  polygonSeries: any
  chart: any

  ngOnChanges(change) {

    if (change && change.currentLatitude && change.currentLatitude.currentValue != change.currentLatitude.previousValue)
      this.currentLatitude = change.currentLatitude.currentValue

    if (change && change.currentLongitude && change.currentLongitude.currentValue != change.currentLongitude.previousValue)
      this.currentLongitude = change.currentLongitude.currentValue

    if (!this.pointSeries)
      return

    this.pointSeries.data.setAll([{
      lat: this.currentLatitude,
      long: this.currentLongitude,
      name: "Current Location"
    }]);

    let chart = this.chart
    this.polygonSeries.events.on("datavalidated", function () {
      chart.goHome();
    })
  }

  async startMapChart() {

    // if (!this.currentLatitude)
    //   return

    var latitude = this.currentLatitude
    var longitude = this.currentLongitude
    //Chart
    let root = am5.Root.new("mapgraph");
    this.chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        projection: am5map.geoMercator(),
        focusable: true,
        homeZoomLevel: 3.5,
        homeGeoPoint: { longitude: longitude, latitude: latitude }
      })
    );

    var chart = this.chart

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
    var geoJson = am5geodata_bangladeshHigh

    if (GlobalConstants.gpsMap == 'brazil') {
      console.log(GlobalConstants.gpsMap)
      geoJson = await import("../../../../assets/maps/brazilHigh").then(module => module.default);
    }

    this.polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geoJson
      })
    );

    this.polygonSeries.mapPolygons.template.setAll({
      stroke: am5.color("#90daee"),
      strokeWidth: 0.5,
      fill: am5.color("#f5f3f3")
    });

    this.polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#f60")
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

    this.pointSeries.data.setAll([{
      lat: this.currentLatitude,
      long: this.currentLongitude,
      name: "Current Location"
    }]);
  }

  ngOnInit(){
      this.startMapChart()
  }
}