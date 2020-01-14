import React from 'react';
import '../ComponentStyles/Generator.css';
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, YAxis, XAxis } from 'react-vis';

class Generator extends React.Component {

  constructor(props){
    super(props);
    let dat = [];
    let styles = {
      position: 'absolute',
      border: '2px solid #000',
      borderRadius: '10px',
      top: this.props.top,
      left: this.props.left
    };
    this.state = {data:dat, styles:styles, counter:0};
    this.props.source.onmessage = (e) => {
      let datum = JSON.parse(e.data);
      console.log(datum)
      if(this.state.counter === 0){
        let dat = [{x: (this.state.counter), y:datum.time}];
        this.state.counter++;
        this.setState({data:dat, styles:this.state.styles, counter:this.state.counter});
      } else {
        let stateData = this.state.data;
        this.state.counter++;
        stateData.shift();
        stateData.push({x: (this.state.counter), y: datum.time});
        this.state.counter++;
        this.setState({data:dat, styles:this.state.styles, counter:this.state.counter});
      }
    }
  }

  render() {

    return (
      <div style={ this.state.styles }>
        <div className="GeneratorTitle">
          <span className="TitleSpan">
            <h2>Generator #{ this.props.id }</h2>
          </span>
          <div className="Plot">
            <XYPlot height={ 150 } width={ 350 }>
              <VerticalGridLines style={ { stroke : "black" } }/>
              <HorizontalGridLines style={ { stroke : "black" } }/>
              <YAxis style={ { stroke : "black" } }/>
              <XAxis style={ { stroke : "black" } }/>
              <LineSeries data={ this.state.data } color="white"/>
            </XYPlot>
          </div>
        </div>
      </div>
    );
  }
}

export default Generator;
