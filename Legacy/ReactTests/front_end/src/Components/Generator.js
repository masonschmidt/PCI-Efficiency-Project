import React from 'react';
import '../ComponentStyles/Generator.css';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, YAxis, XAxis} from 'react-vis';

class Generator extends React.Component {
  render() {
    let styles = {
      position: 'absolute',
      border: '2px solid #000',
      borderRadius: '10px',
      top: this.props.top,
      left: this.props.left
    };
    const data = [
      {x: 0, y: .70},
      {x: 1, y: .67},
      {x: 3, y: .99},
      {x: 3.5, y: .25},
      {x: 4, y: .45},
      {x: 6, y: .65},
      {x: 6.2, y: .72},
      {x: 7.5, y: .34},
      {x: 8, y: .44},
      {x: 9, y: 1.}
    ];
    return (
      <div style={styles}>
        <div className="GeneratorTitle">
          <span className="TitleSpan">
            <h2>Generator #001</h2>
          </span>
          <div className="Plot">
            <XYPlot height={150} width={350}>
              <VerticalGridLines style={{stroke : "black"}}/>
              <HorizontalGridLines style={{stroke : "black"}}/>
              <YAxis style={{stroke : "black"}}/>
              <XAxis style={{stroke : "black"}}/>
              <LineSeries data={data} color="white"/>
            </XYPlot>
          </div>
        </div>
      </div>
    );
  }
}

export default Generator;
