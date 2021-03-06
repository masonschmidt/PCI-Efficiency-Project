import React, { Component } from 'react';
import './Chart.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import AWS from "aws-sdk";

const TABLE_ACCESS_KEY = ""
const TABLE_SECRET_ACCESS_KEY = ""
// Configure aws with your accessKeyId and your secretAccessKey

AWS.config.update({
  region: 'us-west-2', // Put your aws region here
  dynamodb: '2012-08-10',
  accessKeyId: TABLE_ACCESS_KEY,
  secretAccessKey: TABLE_SECRET_ACCESS_KEY
})

//const S3_BUCKET = 'pci-effciency-project-test';
const TABLE_NAME = "efficiency"

//A query to dynamo using the given list of parameters and a dynamodb object.
//This function can be awaited correctly and returns the query results.
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

//Theme for the graphs
am4core.useTheme(am4themes_animated);

//A custom react component that includes a chart connected to AWS
//The chart queries DynamoDB using the following props
// id -> the id of the generator to display
// startDate -> the start of the date range to display
// endDate -> the end of the date range to display
// numRows -> the number of rows in the graph grid (used to calculate size)
// numCols -> the number of columns in the graph grid (used to calculate size)
//The local attributes of the Chart are the following
// lastKey -> the dynamo key for the last received data point (used to retrieve new data)
// chart -> the amcharts chart
// interval -> a function run on a timer, in this case data update every minute
class Chart extends Component {

  //Updates the chart with new data from AWS
  async updateData() {

    //Create a new dynamo object
    let dynamodb = new AWS.DynamoDB();
    //Get the passed generator number and format it it
    let genNum = new Intl.NumberFormat('en-US').format(this.props.id);
    //Empty list to store data
    let chartData = [];
    //Query parameters for AWS
    let tableParams;

    //Create the parameters for the query
    //This currently relies on AWS comparison of dates (I believe it is using string comparison)
    //TODO create more filters to only retrieve new data using the lastKey as
    // KeyConditionExpression does not allow more conditions
    if(this.lastKey !== '') {
      tableParams = {
        KeyConditionExpression: 'generator = :generator AND recentTimeFuel BETWEEN :startDate AND :endDate',
              ExpressionAttributeValues: {
                  ':generator': {'N': genNum},
                  ':startDate': {'S': this.props.startDate.toISOString()},
                  ':endDate': {'S': this.props.endDate.toISOString()}
              },
              TableName: TABLE_NAME,
      };
    }
    else {
      tableParams = {
        KeyConditionExpression: 'generator = :generator AND recentTimeFuel BETWEEN :startDate AND :endDate',
              ExpressionAttributeValues: {
                  ':generator': {'N': genNum},
                  ':startDate': {'S': this.props.startDate.toISOString()},
                  ':endDate': {'S': this.props.endDate.toISOString()}
              },
              TableName: TABLE_NAME,
      };
    }

    //Call and await the query
    let promise = dynamoQuery(tableParams, dynamodb);
    let data = await promise;

    //Process the retrieved data
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

      //Add an new attribute to color the graph
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
   //If data was retrieved then sort it and add it to the chart
   if(chartData.length > 0) {
     let sortedData = chartData.sort((a,b) => new Date(a.recentTimeFuel) - new Date(b.recentTimeFuel));

     this.chart.addData(sortedData, sortedData.length - 1);
     this.lastKey = sortedData[sortedData.length-1]['recentTimeFuel'];
   }

  }

  //Create the initial chart when the component mounts
  async componentDidMount() {

    //Create the new dynamo object
    let dynamodb = new AWS.DynamoDB();
    //Create the generator number formatted
    let genNum = new Intl.NumberFormat('en-US').format(this.props.id);

    //empty list to store chart data
    let chartData = [];

    //Create the parameters for the query
    //This currently relies on AWS comparison of dates (I believe it is using string comparison)
    let tableParams = {
      KeyConditionExpression: 'generator = :generator AND recentTimeFuel BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':generator': {'N': genNum},
                ':startDate': {'S': this.props.startDate.toISOString()},
                ':endDate': {'S': this.props.endDate.toISOString()}
            },
            TableName: TABLE_NAME,
    };

    //Query AWS and await it
    let promise = dynamoQuery(tableParams, dynamodb);
    let data = await promise;

    //Process any retrieved data
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

          //Add an attribute to color the graph
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

    //Sort the retrieved data
    let sortedData = chartData.sort((a,b) => new Date(a.recentTimeFuel) - new Date(b.recentTimeFuel));
    //Set the last key if data was retrieved
    if(data.Items.length > 0) {
      this.lastKey = sortedData[sortedData.length-1]['recentTimeFuel'];
    }
    else {
      this.lastKey = '';
    }

    //Create the chart
    let chart = am4core.create('chartdiv' + this.props.id, am4charts.XYChart);
    //Set the chart data
    chart.data = sortedData;

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "i";

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

    //Set the x axis scale
    dateAxis.baseInterval = {
      "timeUnit": "minute",
      "count": 1
    };
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    //Create title
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
    //Bind the colored graph areas
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
    //If there are too many charts then hide the scrollbar to save space
    if(this.props.numRows >= 3) {
      // Create a horizontal scrollbar with preview and place it underneath the date axis
      chart.scrollbarX.disabled = true;
    }

    valueAxis.min = 0.0;
    valueAxis.max = 1.0;
    valueAxis.strictMinMax = false;

    dateAxis.start = 0.50;
    dateAxis.keepSelection = true;

    //Add the chart as a component attribute
    this.chart = chart;

    //Add the interval for data updates
    const interval = setInterval(() => {
      this.updateData();
    }, 60000);
  }

  componentWillUnmount() {
    //Clear the interval when the chart is unmounted
    clearInterval(this.interval);
    if (this.chart) {
      this.chart.dispose();
    }
  }

  //Render the chart
  render() {
    //Calculate if the scrollbar should be disabled or enabled
    if(this.props.numRows >= 3 && (this.chart != null)) {
      this.chart.scrollbarX.disabled = true;
    }
    else if(this.props.numRows < 3 && (this.chart != null)) {
      this.chart.scrollbarX.disabled = false;
    }

    //Calculate the chart's size based on the number of columns and rows
    let chartHeight = ((window.innerHeight-80)/this.props.numRows)-15;
    let chartWidth = ((window.innerWidth-5)/this.props.numColumns)-10;
    return (
      <div id={'chartdiv' + this.props.id} style={{ width: chartWidth,
        height: chartHeight, float: 'left', border: '1px solid black',
        margin: '4px'}}></div>
    );
  }
}

export default Chart;
