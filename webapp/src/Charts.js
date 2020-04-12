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

  renderCharts()
  {
    let items = [];
    for(var i = 0; i < this.props.generators.length; i++){
      items.push(
        <div id={this.props.generators[i].value} key={this.props.generators[i].value}>
          {this.renderChart(this.props.generators[i].value)}
        </div>
      );
    }
    return items;
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderCharts()}
      </div>
    );
  }
}

export default Charts;
