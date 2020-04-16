import React, { Component } from 'react';
import './App.css';
import Charts from './Charts.js'
import * as qs from 'query-string';
import Select from 'react-select';
import DateTimePicker from 'react-datetime-picker';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const options = [];

class App extends Component {
  constructor(props) {
    super(props);

    // Parse the Query String into JSON
    let parsed = qs.parse(window.location.search);

    if(!Array.isArray(parsed.gen) && parsed.gen){
      if(parsed.gen.length > 4){
        parsed.gen = parsed.gen.split(',');
      } else {
        parsed.gen = [parsed.gen];
      }
    }
    if(parsed.gen){
      for(let i = 0; i < parsed.gen.length; ++i){
        parsed.gen[i] = { value: parsed.gen[i], label: parsed.gen[i] };
      }
    }
    this.selects = parsed.gen;


    for(let i = 1; i <= 3000; i++){
      let str = i.toString();
      while(str.length < 4){
        str = '0' + str;
      }
      options.push({ value: str, label: str });
    }

    // If gen array is empty, declare as empty
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      generators: (parsed.gen) ? parsed.gen : []
    };
  }

  handleDropDownChange = generators => {
    if(!Array.isArray(generators)) {
      generators = [generators]
    }
    this.setState({
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      generators
    });
  }

  handleStartChange = startDate =>
    this.setState({
      startDate,
      endDate: this.state.endDate,
      generators: this.state.generators
    });

  handleEndChange = endDate =>
    this.setState({
      startDate: this.state.startDate,
      endDate,
      generators: this.state.generators
    });

  renderMenu() {
    return (
      <table style={{width: '100%'}}>
        <tbody>
          <tr>
            <td><h3 style={{margin: '0 0 0 0'}}>Generators</h3></td>
            <td><h3 style={{margin: '0 0 0 0'}}>Start Date</h3></td>
            <td><h3 style={{margin: '0 0 0 0'}}>End Date</h3></td>
          </tr>
          <tr>
            <td style={{width: '45%', marginRight: '2%'}}>
              <Select
                value={this.selects}
                onChange={this.handleDropDownChange}
                options={options}
                isMulti
              />
            </td>
            <td style={{width: '26%', marginRight: '2%'}}>
              <DateTimePicker
                value={this.state.startDate}
                onChange={this.handleStartChange}
                maxDate={this.state.endDate}
              />
            </td>
            <td style={{width: '26%'}}>
              <DateTimePicker
                value={this.state.endDate}
                onChange={this.handleEndChange}
                minDate={this.state.startDate}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderCharts() {
    return (
      <Charts
        generators={this.state.generators}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
      />
    );
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderMenu()}
        {this.renderCharts()}
      </div>
    );
  }
}

export default App;
