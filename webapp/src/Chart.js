import React, { Component } from 'react';
import './Chart.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import AWS from "aws-sdk";

const BUCKET_ACCESS_KEY = "AKIARKHXIANXJPYDG6NV"
const BUCKET_SECRET_ACCESS_KEY = "ZeQH9lF5xjd3TkVLnRyVPZjyZ4HfjJh42N1Cor3f"

// Configure aws with your accessKeyId and your secretAccessKey

AWS.config.update({
  region: 'us-west-2', // Put your aws region here
  accessKeyId: BUCKET_ACCESS_KEY,
  secretAccessKey: BUCKET_SECRET_ACCESS_KEY
})

const S3_BUCKET = 'pci-effciency-project-test';

//am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

class Chart extends Component {
  updateData() {
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    let chart = am4core.create('chartdiv' + this.props.id, am4charts.XYChart);

    // Create S3 service object
    //let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    let genNum = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 4 , useGrouping: false}).format(this.props.id);

    let bucketParams = {
      Bucket : S3_BUCKET,
      Prefix : 'generator' + genNum,
      StartAfter: this.lastKey,
    };

    let chartData = [];

    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjectsV2(bucketParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);

        for (let i = 0; i < data.Contents.length; i++){

          let keyToGet = data.Contents[i].Key;

          let params = {
            Bucket: S3_BUCKET,
            Key: keyToGet,
          };

          s3.getObject(params, function(err, objectData) {
             if (err) {
               console.log(err, err.stack); // an error occurred
             }
             else {
               // successful response
                chartData.push(JSON.parse(objectData.Body.toString('ascii')));
                for (let point of chartData)
                {
                  if(point['efficiency'] > 0.7)
                  {
                    const color = '#A9FE36';
                    point['linecolor']  = color;
                  }
                  else {
                    const color = '#F74C15';
                    point['linecolor'] = color;
                  }
                }
                let sortedData = chartData.sort((a,b) => new Date(b.recentTimePower) - new Date(a.recentTimePower));
                this.chart.data.addData(sortedData.length(), sortedData);
                this.lastKey = sortedData[sortedData.length-1];
             }
         });

       }
      }
    });
  }

  componentDidMount() {
    this.lastKey = '';

    let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    let chart = am4core.create('chartdiv' + this.props.id, am4charts.XYChart);

    // Create S3 service object
    //let s3 = new AWS.S3({apiVersion: '2006-03-01'});

    let genNum = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 4 , useGrouping: false}).format(this.props.id);

    let chartData = [];

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "i";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    dateAxis.baseInterval = {
      "timeUnit": "minute",
      "count": 1
    };
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let title = chart.titles.create();
    title.text = "Generator: " + this.props.id;
    title.fontSize = 25;
    title.marginBottom = 30;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "efficiency";
    series.dataFields.dateX = "recentTimePower";
    series.tooltipText = "{efficiency}"
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

    // Create the parameters for calling listObjects
    let bucketParams = {
      Bucket : S3_BUCKET,
      Prefix : 'generator' + genNum,
    };

    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjectsV2(bucketParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);

        for (let i = 0; i < 15; i++){

          let keyToGet = data.Contents[i].Key;

          let params = {
            Bucket: S3_BUCKET,
            Key: keyToGet,
          };

          s3.getObject(params, function(err, objectData) {
             if (err) {
               console.log(err, err.stack); // an error occurred
             }
             else {
               // successful response
                chartData.push(JSON.parse(objectData.Body.toString('ascii')));
                for (let point of chartData)
                {
                  if(point['efficiency'] > 0.7)
                  {
                    const color = '#A9FE36';
                    point['linecolor']  = color;
                  }
                  else {
                    const color = '#F74C15';
                    point['linecolor'] = color;
                  }
                }
                let sortedData = chartData.sort((a,b) => new Date(b.recentTimePower) - new Date(a.recentTimePower));
                chart.data = sortedData;
                this.lastKey = sortedData[sortedData.length-1];
             }
         });

       }
      }
    });

    const interval = setInterval(() => {
      this.updateData();
    }, 60000);
  }

  componentDidUpdate(oldProps) {
    /*
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
    */
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
