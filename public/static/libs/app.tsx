/*
  app.tsx

  Primay script for front-facing web application functionality.
*/

var React = require('react');
var ReactDOM = require('react-dom');

export class App extends React.Component {
  constructor(){
    super();
    this.state = {}
  }

  // Executed only once upon startup.
  componentDidMount(){
    // TODO.
  }

  render() {
    return (
      <div>
        <div id = "mainBackground">
          <div id="mainBackgroundInner">
            <img id="mainBackgroundImg" src={require("../../../assets/mainBackground.jpg").default}/>
          </div>
        </div>
        
        <div id="header">
          <div id="headerInner">
            <div id="title">The Machine Pianist</div>
            <div id="about">
              <button id="aboutButton">About</button>
            </div>
          </div>
        </div>

        <div id="tool">
          <div id="toolInner">
            Play your song!
          </div>
        </div>

        <div id="info">
          <div id="infoInner">
            <div id="charts">
              <img id="chart1Img" class="chartImg" src={require("../../../assets/chart1.png").default}/>
              <img id="chart2Img" class="chartImg" src={require("../../../assets/chart2.png").default}/>
              <img id="chart2Img" class="chartImg" src={require("../../../assets/chart3.png").default}/>
            </div>
            <div id="infotext">
              <h2>What makes a piano performance?</h2>

              <div>This AI-powered tool was created under the conjecture that the key "humanizing" components lacking in widely available online MIDI files are:</div>

              <br/>
              <div>1. Variable velocity of notes when pressed.</div>
              <div>2. Subjective choice of pedal positions throughout a piece.</div>
              <br/>

              <div>That task assigned was thus, given an input MIDI file lacking such details, augment the file with key velocities and pedal positions to produce a more human-sounding performance for any arbitrary piano piece. </div>
            </div>
          </div>
        </div>
      </div>
    )
  };
}

ReactDOM.render(<App />, document.getElementById('app'));