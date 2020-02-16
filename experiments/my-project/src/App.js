import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Charts from './Charts.js'
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
      data: this.props.data.slice(),
      numCharts: 4,
    };
  }

  renderCharts(num) {
    return (
      <Charts
        data={this.state.data}
        numCharts={num}
      />
    );
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderCharts(this.state.numCharts)}
      </div>
    );
  }
}

export default App;
