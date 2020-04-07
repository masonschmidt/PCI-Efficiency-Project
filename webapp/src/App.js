import React, { Component } from 'react';
import './App.css';
import Charts from './Charts.js'
import * as qs from 'query-string';
import Select from 'react-select';

const options = [];

class App extends Component {
  constructor(props) {
    super(props);

    // Parse the Query String into JSON
    let parsed = qs.parse(window.location.search);

    // Create DropDown Options 1:3000
    // { value: '0001', label: '0001' }
    // WARNING: 3000 makes the list slow.
    // MAYBE SOME FIXES needed
    for(let i = 1; i <= 1500; i++){
      let str = i.toString();
      while(str.length < 4){
        str = '0' + str;
      }
      options.push({ value: str, label: str });
    }

    // If gen array is empty, declare as empty
    this.state = {
      generators: (parsed.gen) ? parsed.gen : []
    };

  }

  handleDropDownChange = selectedOption => {

    // http://LocalHost:3000/?gen=3000&gen=0001
    let newLocation = window.location.href;

    // Append the correct value to query string
    if(window.location.href.indexOf('?') < 0){
      newLocation += '?gen=' + selectedOption.value;
    } else {
      newLocation += '&gen=' + selectedOption.value;
    }

    // Redirect to webpage with generator value
    window.location.replace(newLocation);
  };

  renderDropDown() {
    return (
      <Select
        onChange={this.handleDropDownChange}
        options={options}
      />
    );
  }

  renderCharts() {
    return (
      <Charts
        generators={this.state.generators}
      />
    );
  }

  render() {
    return (
      <div id="allchartsdiv">
        {this.renderDropDown()}
        {this.renderCharts()}
      </div>
    );
  }
}

export default App;
