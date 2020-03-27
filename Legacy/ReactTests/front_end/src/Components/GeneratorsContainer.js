import React from 'react';
import '../ComponentStyles/GeneratorsContainer.css';
import Generator from './Generator';

class GeneratorsContainer extends React.Component {
  render() {
    return (
      <div className="GeneratorsContainer">
        <Generator top='1%' left='.5%'/>
        <Generator top='1%' left='20.5%'/>
        <Generator top='1%' left='40.5%'/>
        <Generator top='1%' left='60.5%'/>
        <Generator top='1%' left='80.5%'/>
        <Generator top='25.6%' left='.5%'/>
        <Generator top='25.6%' left='20.5%'/>
        <Generator top='25.6%' left='40.5%'/>
        <Generator top='25.6%' left='60.5%'/>
        <Generator top='25.6%' left='80.5%'/>
        <Generator top='50.2%' left='.5%'/>
        <Generator top='50.2%' left='20.5%'/>
        <Generator top='50.2%' left='40.5%'/>
        <Generator top='50.2%' left='60.5%'/>
        <Generator top='50.2%' left='80.5%'/>
        <Generator top='74.8%' left='.5%'/>
        <Generator top='74.8%' left='20.5%'/>
        <Generator top='74.8%' left='40.5%'/>
        <Generator top='74.8%' left='60.5%'/>
        <Generator top='74.8%' left='80.5%'/>
      </div>
    );
  }
}

export default GeneratorsContainer;
