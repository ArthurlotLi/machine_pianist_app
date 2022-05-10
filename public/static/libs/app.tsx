/*
  app.tsx

  Primary script for front-facing web application functionality.
  Apologies for any bad practices - this is a quickie deployment
  website. -Arthur
*/

const React = require('react');
const ReactDOM = require('react-dom');

const cloudInferenceMachinePianist = "/performMidi"

// Initial styles for tool divs. These will change mainly in terms
// of visibility. 

const toolInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "110px",
  display: "block",
  visibility: "visible",
  pointerEvents: "auto",
};

const toolProgressInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "110px",
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
};

const toolPlayerInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "110px",
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
};

export class App extends React.Component {

  audio = null

  state = {
    selectedFile: null,
    performanceMidi: null,
    performanceWav: null,
    displayedFileName: "Select a MIDI file...",
    toolInterfaceStyle : toolInterfaceStyleInitial,
    toolProgressStyle : toolProgressInterfaceStyleInitial,
    toolPlayerStyle : toolPlayerInterfaceStyleInitial,
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

    if(this.audio == null){
      this.audio = new Audio("data:audio/wav;base64," + this.state.performanceWav);
      this.audio.play();
    }
    else if (this.audio.paused){
      this.audio.play();
    }
    else {
      this.audio.pause();
    }
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

    // If we have submitted a valid file, show the progress bar. 
    this.showToolProgress();

    // Next, load the file string and encode it, before sending it.
    try{
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
        this.showToolPlayer();
      };
      reader.readAsBinaryString(this.state.selectedFile)
    }
    catch(e){
      console.log("[ERROR] Exception occured during performance! Exception:");
      console.log(e);
      alert("Sorry, something went wrong during performance! Please try again later.");
      this.showTool();
    }
  };

  // Show the 1st tool (submission) and hide all others. 
  showTool() {
    var modifiedToolInterfaceStyle = Object.assign({}, this.state.toolInterfaceStyle);
    var modifiedToolProgressStyle = Object.assign({}, this.state.toolProgressStyle);
    var modifiedToolPlayerStyle = Object.assign({}, this.state.toolPlayerStyle);

    modifiedToolInterfaceStyle["display"] = "block";
    modifiedToolInterfaceStyle["visibility"] = "visible";
    modifiedToolInterfaceStyle["pointerEvents"] = "auto";
    modifiedToolProgressStyle["display"] = "none";
    modifiedToolProgressStyle["visibility"] = "hidden";
    modifiedToolProgressStyle["pointerEvents"] = "none";
    modifiedToolPlayerStyle["display"] = "none";
    modifiedToolPlayerStyle["visibility"] = "hidden";
    modifiedToolPlayerStyle["pointerEvents"] = "none";

    this.setState({
      toolInterfaceStyle : modifiedToolInterfaceStyle,
      toolProgressStyle : modifiedToolProgressStyle,
      toolPlayerStyle : modifiedToolPlayerStyle,
    });
  }

  // Show the 2nd tool (progress) and hide all others. 
  showToolProgress() {
    var modifiedToolInterfaceStyle = Object.assign({}, this.state.toolInterfaceStyle);
    var modifiedToolProgressStyle = Object.assign({}, this.state.toolProgressStyle);
    var modifiedToolPlayerStyle = Object.assign({}, this.state.toolPlayerStyle);

    modifiedToolInterfaceStyle["display"] = "none";
    modifiedToolInterfaceStyle["visibility"] = "hidden";
    modifiedToolInterfaceStyle["pointerEvents"] = "none";
    modifiedToolProgressStyle["display"] = "block";
    modifiedToolProgressStyle["visibility"] = "visible";
    modifiedToolProgressStyle["pointerEvents"] = "auto";
    modifiedToolPlayerStyle["display"] = "none";
    modifiedToolPlayerStyle["visibility"] = "hidden";
    modifiedToolPlayerStyle["pointerEvents"] = "none";

    this.setState({
      toolInterfaceStyle : modifiedToolInterfaceStyle,
      toolProgressStyle : modifiedToolProgressStyle,
      toolPlayerStyle : modifiedToolPlayerStyle,
    });
  }

  // Show the 2nd tool (progress) and hide all others. 
  showToolPlayer() {
    var modifiedToolInterfaceStyle = Object.assign({}, this.state.toolInterfaceStyle);
    var modifiedToolProgressStyle = Object.assign({}, this.state.toolProgressStyle);
    var modifiedToolPlayerStyle = Object.assign({}, this.state.toolPlayerStyle);

    modifiedToolInterfaceStyle["display"] = "none";
    modifiedToolInterfaceStyle["visibility"] = "hidden";
    modifiedToolInterfaceStyle["pointerEvents"] = "none";
    modifiedToolProgressStyle["display"] = "none";
    modifiedToolProgressStyle["visibility"] = "hidden";
    modifiedToolProgressStyle["pointerEvents"] = "none";
    modifiedToolPlayerStyle["display"] = "block";
    modifiedToolPlayerStyle["visibility"] = "visible";
    modifiedToolPlayerStyle["pointerEvents"] = "auto";

    this.setState({
      toolInterfaceStyle : modifiedToolInterfaceStyle,
      toolProgressStyle : modifiedToolProgressStyle,
      toolPlayerStyle : modifiedToolPlayerStyle,
    });
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
            <div id="toolInterface" style={this.state.toolInterfaceStyle}>
              
              <div id="toolInterfaceMidi">
                <label class="custom-file-upload">
                  <div id="toolInterfaceInputFilename">{this.state.displayedFileName}</div>
                  <input type="file" id="toolInterfaceInput" onChange={this.onFileChange} />
                </label>
                <button id="toolInterfaceButtonPerform" onClick={this.onPerformSong}>Perform Song</button>
              </div>

              <div id="toolInterfacePreloaded">
                <select id="toolInterfacePreloadedSelect">
                  <option value="Seven Nation Army">Seven Nation Army</option>
                  <option value="Spider Dance">Spider Dance</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        <div id="toolProgress">
          <div id="toolProgressInner">
            <div id="toolProgressInterface" style={this.state.toolProgressStyle}>
              Performing "{this.state.displayedFileName.replace(".mid", "").replace(".midi", "").replace("_", " ")}"...
            </div>
          </div>
        </div>

        <div id="toolPlayer">
          <div id="toolPlayerInner">
            <div id="toolPlayerInterface" style={this.state.toolPlayerStyle}>
              <div>
                "{this.state.displayedFileName.replace(".mid", "").replace(".midi", "").replace("_", " ")}"
              </div>
              <div id="toolPlayerInterfacePerformance">
                <button id="toolPlayerInterfaceButtonListen" onClick={this.onPlayInBrowser.bind(this)}>Play in Browser</button>
                <button id="toolPlayerInterfaceButtonSaveMp3">Save Audio</button>
                <button id="toolPlayerInterfaceButtonSaveMidi">Save Midi</button>
              </div>
              <div>
              <button id="toolPlayerInterfaceReturn" onClick={this.showTool}>Perform Another Song</button>
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