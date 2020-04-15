import React, { Component } from 'react';
import './App.css';
import Chart from './Chart.js'

class Charts extends Component {
  renderChart(row, numRows, numColumns, numCharts) {
    let items = []
    for(var j = 0; j < numColumns && (row-1)*numColumns + 1 + j <= numCharts; j++) {
      if(numCharts > 1) {
        items.push(
          <Chart
            id={this.props.generators[(row-1)*numColumns + j].value}
            numRows={numRows}
            numColumns={numColumns}
            key={this.props.generators[(row-1)*numColumns + j].value}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
          />
        )
      }
      else {
        items.push(
          <Chart
            id={"0001"}
            numRows={numRows}
            numColumns={numColumns}
            key={"0001"}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
          />
        )
      }
    }
    return items;
  }

  renderCharts()
  {

    let items = []

    let numRows = Math.ceil(Math.sqrt(this.props.generators.length));
    let numColumns = Math.floor(Math.log2(this.props.generators.length+1));
    let numCharts = 0;
    if(Array.isArray(this.props.generators)) {
      numCharts = this.props.generators.length;
    }
    else {
      numCharts = 1;
    }
    if(numCharts > 0) {
      let numRows = Math.ceil(Math.sqrt(numCharts));
      let numColumns = Math.floor(Math.log2(numCharts+1));
      for(var i = 1; i <= numRows; i++){
        items.push(
          <div id={i} key={i} className='chartRow'>
            {this.renderChart(i, numRows, numColumns, numCharts)}
          </div>
        );
      }
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
