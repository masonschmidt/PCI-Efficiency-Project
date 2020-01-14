// This is the Root Div that is technically the body component

// Import React and the Corresponding CSS Style Sheet
import React from 'react';
import '../ComponentStyles/App.css';

// Import the 3 Components for the Root
// The Top Navigation Component (NOT NEEDED)
// The Middle Generators Container (NEEDED)
// The Bottom Title Component (NOT NEEDED)
import TopNav from './TopNav';
import GeneratorsContainer from './GeneratorsContainer';
import Title from './Title'; //Played w/ Windows Pen

//Function that Sets the App Component as  Root Container
class App extends React.Component{

  render(){
    //Return this JSX to the Root.
    return (
      <div className="App">
        <TopNav />
        <GeneratorsContainer />
        <Title />
      </div>
    );
  }
}

//Exports this Function for React to Use.
export default App;
