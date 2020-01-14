import React from 'react';
import '../ComponentStyles/TopNav.css';

class TopNav extends React.Component {
  render() {
    return (
      <div className="TopNav">
        <select>
          <option value="001">Generator #001</option>
        </select>
      </div>
    );
  }
}

export default TopNav;
