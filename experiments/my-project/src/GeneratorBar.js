import React, { Component } from 'react';
import './GeneratorBody.css';


class GeneratorBody extends Component {
  render() {
    return (
      <div id="gensearchdiv">
        {this.renderCharts()}
      </div>
    );
  }
}

export default GeneratorBody;
