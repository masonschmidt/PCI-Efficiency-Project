import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Charts from './Charts.js'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data.slice(),
      numCharts: 8,
    };
  }

  renderCharts() {
    return (
      <Charts
        data={this.state.data}
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
