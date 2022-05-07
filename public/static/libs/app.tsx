/*
  app.tsx

  Primary script for front-facing web application functionality.
  Apologies for any bad practices - this is a quickie deployment
  website. -Arthur
*/

const React = require('react');
const ReactDOM = require('react-dom');
import midiPlayerJs from "midi-player-js";

const cloudInferenceMachinePianist = "/performMidi"

export class App extends React.Component {
  state = {
    selectedFile: null,
    performanceMidi: null,
    performanceWav: null,
    displayedFileName: "Select a MIDI file...",
  };

  constructor(){
    super();
  }

  // Executed only once upon startup.
  componentDidMount(){
    // TODO.
  }

  onPlayInBrowser() {   
    if(this.state.performanceWav == null){
      alert("Please submit a MIDI file to be performed first!")
      return
    } 

    var snd = new Audio("data:audio/wav;base64," + this.state.performanceWav);
    snd.play();

    /*
    if(this.state.performanceMidi == null){
      alert("Please submit a MIDI file to be performed first!")
      return
    }

    // Initialize player and register event handler
    console.log("[DEBUG] Initializing new midi player js.");
    var Player = new midiPlayerJs.Player(function(event) {
      console.log(event)
      if (event.name == 'Note on') {
        let note = event.noteNumber
        let velocity = event.velocity
        //instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
        //document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
        //console.log(event)
      }
      else if (event.name == 'Controller Change'){
       let value = event.value 
       let control = event.noteNumber
      }
    });

    // Load our saved midi.
    let midiString = this.state.performanceMidi;//+ "ÿ/ ";
    console.log(midiString)

    var buf = new ArrayBuffer(midiString.length*2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=midiString.length; i < strLen; i++) {
      bufView[i] = midiString.charCodeAt(i);
    }

    Player.loadArrayBuffer(buf);
    Player.play();*/
	}

  // When the user has selected a new file. 0
  onFileChange = event => {
    this.setState({
      selectedFile: event.target.files[0],
      displayedFileName: event.target.files[0].name
    })
  };

  // When the user submits a file. 
  onPerformSong = () => {
    // First, verify that the file is a MIDI. 
    if(this.state.selectedFile.type != "audio/midi" && this.state.selectedFile.type != "audio/mid"){
      console.log(`[ERROR] Invalid file type ${this.state.selectedFile.type} selected!`)
      alert("Only .mid or .midi files are supported! Please select a valid file to perform.");
      return
    }

    // Next, load the file string and encode it, before sending it.
    const reader = new FileReader()
    reader.onload = async (e) => { 
      // Load the binary data. 
      var text = (e.target.result).toString()

      // Base64 encode the file string for HTTP transfer
      let encodedString = Buffer.from(text.toString(), 'binary').toString('base64');

      // Generate the form and send it off! 
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "midi": encodedString, "generate_wav" : "1" })
      };
      console.log("[DEBUG] Submitting request to cloud inference server with body:", requestOptions)
      var startTime = performance.now();
      const response = await fetch(cloudInferenceMachinePianist, requestOptions);
      const data = await response.json();
      var endTime = performance.now();
      var totalTime = (endTime - startTime)/1000;
      console.log(`[DEBUG] Cloud Inference round-trip time: ${totalTime}. Return data:`, data)
      
      // We have our base64 encoded midi file with performance data! 
      // Let's now decode it and store it.
      let performanceMidi = Buffer.from(data['0'], "base64").toString('binary');
      this.setState({
        performanceMidi: performanceMidi
      })
      this.setState({
        performanceWav: data['1']
      })
    };
    reader.readAsBinaryString(this.state.selectedFile)
  };

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
            <div id="toolInterface">
              <div id="toolInterfaceMidi">
                <label class="custom-file-upload">
                  <div id="toolInterfaceInputFilename">{this.state.displayedFileName}</div>
                  <input type="file" id="toolInterfaceInput" onChange={this.onFileChange} />
                </label>
                <button id="toolInterfaceButtonPerform" onClick={this.onPerformSong}>Perform Song</button>
              </div>
              <div id="toolInterfacePerformance">
                <button id="toolInterfaceButtonListen" onClick={this.onPlayInBrowser.bind(this)}>Play in Browser</button>
                <button id="toolInterfaceButtonSaveMp3">Save Mp3</button>
                <button id="toolInterfaceButtonSaveMidi">Save Midi</button>
              </div>
            </div>
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