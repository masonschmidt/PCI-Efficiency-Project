import React from 'react';
import '../ComponentStyles/GeneratorsContainer.css';
import Generator from './Generator';

class GeneratorsContainer extends React.Component {
  render() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get('id');
    let ids = foo.split(',');
    console.log(ids);
    let count = 0;
    var sources = []
    for(let i = 1; i <= 20; ++i){
      sources.push(new EventSource('http://127.0.0.1:3001/generator/' + i + '/'));
    }
    var gens=[
      { top: '1%',    left: '.5%',   num: '0001', source:sources[0] },
      { top: '1%',    left: '20.5%', num: '0002', source:sources[1] },
      { top: '1%',    left: '40.5%', num: '0003', source:sources[2] },
      { top: '1%',    left: '60.5%', num: '0004', source:sources[3] },
      { top: '1%',    left: '80.5%', num: '0005', source:sources[4] },
      { top: '25.6%', left: '.5%',   num: '0006', source:sources[5] },
      { top: '25.6%', left: '20.5%', num: '0007', source:sources[6] },
      { top: '25.6%', left: '40.5%', num: '0008', source:sources[7] },
      { top: '25.6%', left: '60.5%', num: '0009', source:sources[8] },
      { top: '25.6%', left: '80.5%', num: '0010', source:sources[9] },
      { top: '50.2%', left: '.5%',   num: '0011', source:sources[10] },
      { top: '50.2%', left: '20.5%', num: '0012', source:sources[11] },
      { top: '50.2%', left: '40.5%', num: '0013', source:sources[12] },
      { top: '50.2%', left: '60.5%', num: '0014', source:sources[13] },
      { top: '50.2%', left: '80.5%', num: '0015', source:sources[14] },
      { top: '74.8%', left: '.5%',   num: '0016', source:sources[15] },
      { top: '74.8%', left: '20.5%', num: '0017', source:sources[16] },
      { top: '74.8%', left: '40.5%', num: '0018', source:sources[17] },
      { top: '74.8%', left: '60.5%', num: '0019', source:sources[18] },
      { top: '74.8%', left: '80.5%', num: '0020', source:sources[19] }
    ]
    return (
      <div className="GeneratorsContainer">
      {gens.map((g) => (
        <Generator top={ g.top } left={ g.left } id={ g.num } source={ g.source }/>
      ))}
      </div>
    );
  }
}




export default GeneratorsContainer;
