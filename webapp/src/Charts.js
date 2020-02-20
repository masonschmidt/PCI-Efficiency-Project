import React, { Component } from 'react';
import './App.css';
import Chart from './Chart.js'

class Charts extends Component {
  renderChart(id) {
    return (
      <Chart
        id={id}
      />
    );
  }

  renderCharts(numCharts)
  {
    let items = []
    for(var i = 1; i <= this.props.numCharts; i++){
      items.push(
        <div id={i} key={i}>
          {this.renderChart(i)}
        </div>
      );
    }
    return items;
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderCharts(this.props.numCharts)}
      </div>
    );
  }
}

export default Charts;
