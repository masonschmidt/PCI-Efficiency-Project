import React, { Component } from 'react';
import './App.css';
import Charts from './Charts.js'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numCharts: 1,
    };
  }

  renderCharts() {
    return (
      <Charts
        numCharts={this.state.numCharts}
      />
    );
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderCharts()}
      </div>
    );
  }
}

export default App;
