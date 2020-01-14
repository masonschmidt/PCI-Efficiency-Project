import React from 'react';
import '../ComponentStyles/Title.css';
import logo from '../Pictures/PCI_PNG.png';

class Title extends React.Component {
  render() {
    return (
      <div className="Title">
        <span>
          <img src={logo} alt="PCI Title Pic" />
        </span>
      </div>
    );
  }
}

export default Title;
