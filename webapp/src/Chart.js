import React, { Component } from 'react';
import './Chart.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import AWS from "aws-sdk";

// const BUCKET_ACCESS_KEY = "AKIARKHXIANXJPYDG6NV"
// const BUCKET_SECRET_ACCESS_KEY = "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"
const TABLE_ACCESS_KEY = "AKIARKHXIANXO77WR4X5"
const TABLE_SECRET_ACCESS_KEY = "W42ZM2Q7JvLRWOOcQw4QSzUe5zbNPWauiTOFFhjL"
// Configure aws with your accessKeyId and your secretAccessKey

AWS.config.update({
  region: 'us-west-2', // Put your aws region here
  dynamodb: '2012-08-10',
  accessKeyId: TABLE_ACCESS_KEY,
  secretAccessKey: TABLE_SECRET_ACCESS_KEY
})

//const S3_BUCKET = 'pci-effciency-project-test';
const TABLE_NAME = "efficiency"

async function dynamoQuery(params, dynamodb) {
  // Call S3 to obtain a list of the objects in the bucket
  return new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      }
      else {
        if ( err ) reject(err)
        else {
          resolve(data);
        }
      }
    });
  });
}


//am4core.useTheme(am4themes_dark);

am4core.useTheme(am4themes_animated);

class Chart extends Component {
  async updateData() {

    let dynamodb = new AWS.DynamoDB();
    let genNum = new Intl.NumberFormat('en-US').format(this.props.id);
    let chartData = [];

    let tableParams = {
      KeyConditionExpression: 'generator = :generator AND recentTimeFuel > :recentTimeFuel AND recentTimeFuel BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':generator': {'N': genNum},
                ':recentTimeFuel': {'S': this.lastKey},
                ':startDate': {'S': this.props.startDate.toISOString()},
                ':endDate': {'S': this.props.endDate.toISOString()}
            },
            TableName: TABLE_NAME,
    };


    let promise = dynamoQuery(tableParams, dynamodb);
    let data = await promise;

    for (let i = 0; i < data.Items.length; i++){

      let point =  data.Items[i];
      point.avgPower = parseFloat(point.avgPower.S);
      point.startTimePower = point.startTimePower.S;
      point.avgFuel = parseFloat(point.avgFuel.S);
      point.efficiency = parseFloat(point.efficiency.S);
      point.generator = point.generator.N.padStart(4, '0');
      point.fuelTotal = parseFloat(point.fuelTotal.S);
      point.recentTimePower = point.recentTimePower.S;
      point.startTimeFuel = point.startTimeFuel.S;
      point.recentTimeFuel = point.recentTimeFuel.S;
      point.powerTotal = parseFloat(point.powerTotal.S);

      let keyToGet = data.Items[i].recentTimeFuel;

      if(point.efficiency > 0.7)
      {
        const color = '#A9FE36';
        point['linecolor']  = color;
      }
      else {
        const color = '#F74C15';
        point['linecolor'] = color;
      }
      point['recentTimeFuel'] = keyToGet;

      chartData.push(point);

   }
   if(chartData.length > 0) {
     let sortedData = chartData.sort((a,b) => new Date(a.recentTimeFuel) - new Date(b.recentTimeFuel));

     this.chart.addData(sortedData, sortedData.length - 1);
     this.lastKey = sortedData[sortedData.length-1]['recentTimeFuel'];
   }

  }

  async componentDidMount() {

    let dynamodb = new AWS.DynamoDB();
    let genNum = new Intl.NumberFormat('en-US').format(this.props.id);

    //let data;
    let chartData = [];

    let tableParams = {
      KeyConditionExpression: 'generator = :generator AND recentTimeFuel BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':generator': {'N': genNum},
                ':startDate': {'S': this.props.startDate.toISOString()},
                ':endDate': {'S': this.props.endDate.toISOString()}
            },
            TableName: TABLE_NAME,
    };

    let promise = dynamoQuery(tableParams, dynamodb);
    let data = await promise;

    if(data.Items.length > 0) {

      for (let i = 0; i < data.Items.length; i++){

          let point = data.Items[i];
          point.avgPower = parseFloat(point.avgPower.S);
          point.startTimePower = point.startTimePower.S;
          point.avgFuel = parseFloat(point.avgFuel.S);
          point.efficiency = parseFloat(point.efficiency.S);
          point.generator = point.generator.N.padStart(4, '0');
          point.fuelTotal = parseFloat(point.fuelTotal.S);
          point.recentTimePower = point.recentTimePower.S;
          point.startTimeFuel = point.startTimeFuel.S;
          point.recentTimeFuel = point.recentTimeFuel.S;
          point.powerTotal = parseFloat(point.powerTotal.S);

          let keyToGet = data.Items[i].recentTimeFuel;

          if(point.efficiency > 0.7)
          {
            const color = '#A9FE36';
            point['linecolor']  = color;
          }
          else {
            const color = '#F74C15';
            point['linecolor'] = color;
          }
          point['recentTimeFuel'] = keyToGet;

          chartData.push(point);

       }
    }

    let sortedData = chartData.sort((a,b) => new Date(a.recentTimeFuel) - new Date(b.recentTimeFuel));
    if(data.length > 0) {
      this.lastKey = sortedData[sortedData.length-1]['recentTimeFuel'];
    }

    let chart = am4core.create('chartdiv' + this.props.id, am4charts.XYChart);
    chart.data = sortedData;

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
    series.dataFields.dateX = "recentTimeFuel";
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

    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    if(this.props.numRows >= 3) {
      // Create a horizontal scrollbar with preview and place it underneath the date axis
      chart.scrollbarX.disabled = true;
    }

    valueAxis.min = 0.0;
    valueAxis.max = 1.0;
    valueAxis.strictMinMax = false;

    dateAxis.start = 0.50;
    dateAxis.keepSelection = true;

    this.chart = chart;

    const interval = setInterval(() => {
      this.updateData();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    if(this.props.numRows >= 3 && (this.chart != null)) {
      this.chart.scrollbarX.disabled = true;
    }
    else if(this.props.numRows < 3 && (this.chart != null)) {
      this.chart.scrollbarX.disabled = false;
    }
    let chartHeight = ((window.innerHeight-65)/this.props.numRows)-15;
    let chartWidth = (window.innerWidth/this.props.numColumns)-10;
    return (
      <div id={'chartdiv' + this.props.id} style={{ width: chartWidth,
        height: chartHeight, float: 'left', border: '1px solid black',
        margin: '4px'}}></div>
    );
  }
}

export default Chart;
