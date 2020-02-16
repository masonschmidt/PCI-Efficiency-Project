import React, { Component } from 'react';
import logo from './logo.svg';
import './Chart.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

//am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

class Chart extends Component {
  componentDidMount() {

    let chart = am4core.create('chartdiv' + this.props.id, am4charts.XYChart);

    let colorData = this.props.data.slice();

    for (let point of colorData)
    {
      if(point['value'] > 20)
      {
        const color = '#A9FE36';
        point['linecolor']  = color;
      }
      else {
        const color = '#F74C15';
        point['linecolor'] = color;
      }
    }

    chart.data = colorData;

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let title = chart.titles.create();
    title.text = "Generator: " + this.props.id;
    title.fontSize = 25;
    title.marginBottom = 30;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";
    series.fillOpacity = 0.4;
    series.propertyFields.stroke = "linecolor";
    series.propertyFields.fill = "linecolor";

    // Make bullets grow on hover
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    dateAxis.start = 0.50;
    dateAxis.keepSelection = true;

    this.chart = chart;
  }

  componentDidUpdate(oldProps) {
    if (oldProps.data !== this.props.data) {
      const point = this.props.data.slice(this.props.data.length-1)[0];
      if(point['value'] > 20)
      {
        const color = '#A9FE36';
        point['linecolor']  = color;
      }
      else {
        const color = '#F74C15';
        point['linecolor'] = color;
      }
      this.chart.addData(point, 1);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id={'chartdiv' + this.props.id} style={{ width: "100%", height: "500px" }}></div>
    );
  }
}

export default Chart;
