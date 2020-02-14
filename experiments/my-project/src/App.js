import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from './Chart.js'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data.slice(0,10),
      start: 0,
      end: 10,
    };
  }

  updateData() {
    const end = this.state.end;
    if(end >= this.props.data.length){
      const data = this.props.data.slice(0,10)
      this.setState({
        data: data,
        start: 0,
        end: 10,
      });
    }
    else {
      const data = this.props.data.slice(this.state.start + 1,this.state.end + 1)
      this.setState({
        data: data,
        start: this.state.start + 1,
        end: this.state.end + 1,
      });
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.updateData(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  renderChart() {
    return (
      <Chart
        data={this.state.data}
      />
    );
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderChart()}
      </div>
    );
  }
}

export default App;
