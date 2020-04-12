import React, { Component } from 'react';
import './App.css';
import Chart from './Chart.js'

class Charts extends Component {
  renderChart(row, numRows, numColumns, numCharts) {
    let items = []
    for(var j = 0; j < numColumns && (row-1)*numColumns + 1 + j <= numCharts; j++) {
      items.push(
        <Chart
          id={this.props.generators[(row-1)*numColumns + 1 + j]}
          numRows={numRows}
          numColumns={numColumns}
          key={this.props.generators[(row-1)*numColumns + 1 + j]}
        />
      )
    }
    return items;
  }

  renderCharts()
  {
<<<<<<< HEAD
    let items = [];
    for(var i = 0; i < this.props.generators.length; i++){
      items.push(
        <div id={this.props.generators[i].value} key={this.props.generators[i].value}>
          {this.renderChart(this.props.generators[i].value)}
=======
    let items = []
    let numRows = Math.ceil(Math.sqrt(this.props.generators.length));
    let numColumns = Math.floor(Math.log2(this.props.generators.length+1));
    for(var i = 1; i <= numRows; i++){
      items.push(
        <div id={i} key={i} className='chartRow'>
          {this.renderChart(i, numRows, numColumns, this.props.generators.length)}
>>>>>>> 3882d5f02ae25efc6f7a80da399098bc3bbd57c0
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
