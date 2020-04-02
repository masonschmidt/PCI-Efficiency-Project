import React, { Component } from 'react';
import './App.css';
import Chart from './Chart.js'

class Charts extends Component {
  renderChart(row, numRows, numColumns) {
    let items = []
    for(var j = 0; j < numColumns; j++) {
      items.push(
        <Chart
          id={(row-1)*numColumns + 1 + j}
          numRows={numRows}
          numColumns={numColumns}
          key={(row-1)*numColumns + 1 + j}
        />
      )
    }
    return items;
  }

  renderCharts(numCharts)
  {
    let items = []
    let numRows = Math.ceil(Math.sqrt(numCharts));
    let numColumns = Math.floor(Math.log2(numCharts));
    for(var i = 1; i <= numRows; i++){
      items.push(
        <div id={i} key={i} className='chartRow'>
          {this.renderChart(i, numRows, numColumns)}
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
