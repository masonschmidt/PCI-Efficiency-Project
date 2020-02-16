import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from './Chart.js'

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data.slice(0,20),
      start: 0,
      end: 20,
    };
  }

  updateData() {
    const end = this.state.end;
    if(end >= this.props.data.length){
      const data = this.props.data.slice(0,20)
      this.setState({
        data: data,
        start: 0,
        end: 20,
      });
    }
    else {
      const data = this.props.data.slice(this.state.start + 1,this.state.end + 1)
      this.setState({
        data: data,
        start: this.state.start + 1,
        end: this.state.end + 1,
      });
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.updateData(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  renderChart(id) {
    return (
      <Chart
        data={this.state.data}
        id={id}
      />
    );
  }

  renderCharts(numCharts)
  {
    let items = []
    for(var i = 1; i <= this.props.numCharts; i++){
      items.push(
        <div id={i}>
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
