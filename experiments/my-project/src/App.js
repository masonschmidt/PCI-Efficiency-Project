import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Charts from './Charts.js'


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
