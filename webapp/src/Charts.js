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

  renderCharts(generators)
  {
    let items = []
    let numRows = Math.ceil(Math.sqrt(this.props.generators.length));
    let numColumns = Math.floor(Math.log2(this.props.generators.length+1));
    for(var i = 1; i <= numRows; i++){
      items.push(
        <div id={i} key={i} className='chartRow'>
          {this.renderChart(i, numRows, numColumns, this.props.generators.length)}
        </div>
      );
    }
    return items;
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderCharts(this.props.generators)}
      </div>
    );
  }
}

export default Charts;
