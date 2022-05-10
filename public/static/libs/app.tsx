/*
  app.tsx

  Primary script for front-facing web application functionality.
  Apologies for any bad practices - this is a quickie deployment
  website. -Arthur
*/

const React = require('react');
const ReactDOM = require('react-dom');

const cloudInferenceMachinePianist = "/cloudInference/performMidi"

// Initial styles for tool divs. These will change mainly in terms
// of visibility. 

const toolInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "140px",
  display: "block",
  visibility: "visible",
  pointerEvents: "auto",
  overflow: "hidden",
  padding: "5px",
};

const toolProgressInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "90px",
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
  overflow: "hidden",
  padding: "5px",
};

const toolPlayerInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "max(50%, 450px)",
  margin: "0 auto",
  height: "200px",
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
  overflow: "hidden",
  padding: "5px",
};

const defaultDisplayedFileName = "Select a .mid or .midi file to perform...";
const defaultDisplayedSamplePerformance = { "--- Select a sample performance ---": ""}

// Small standard object to pass around to cite sample song locations. 
class SamplePerformance {
  songName = null
  src = null
  hyperlink = null
  constructor(songName, src, hyperlink){
    this.songName = songName;
    this.src = src;
    this.hyperlink = hyperlink;
  }
};

// Declare all sample songs.
const sampleSongObjects = [
  new SamplePerformance("Spider Dance", 
    "../../../assets/lattice.mp3",
    "https://musescore.com/user/441326/scores/5543583"),
  new SamplePerformance("Seven Nation Army", 
  "../../../assets/seven nation army.mp3",
    "https://musescore.com/user/27050094/scores/4835229"),
  new SamplePerformance("Melody of Water (Duet)", 
    "../../../assets/water.mp3",
    "https://musescore.com/shadowtenshii/scores/5082965"),
  new SamplePerformance("My Castle Town", 
    "../../../assets/castle.mp3",
    "https://musescore.com/user/34759039/scores/7017953"),
  new SamplePerformance("Dream On", 
    "../../../assets/dream on.mp3",
    "https://musescore.com/user/36070839/scores/6811642"),
  new SamplePerformance("Take me to Church", 
    "../../../assets/church.mp3",
    "https://musescore.com/user/1055536/scores/3974821"),
  new SamplePerformance("Grant's Etude", 
    "../../../assets/blue brown.mp3",
    "https://musescore.com/user/3448751/scores/6091506"),
  new SamplePerformance("Megalovania", 
    "../../../assets/megalovania.mp3",
    "https://musescore.com/user/73972/scores/1352796"),
  new SamplePerformance("Waltz in A Minor", 
    "../../../assets/waltz.mp3",
    "https://musescore.com/user/4609986/scores/1749181"),
  new SamplePerformance("Prélude No. 14 BWV 883 in F♯ Minor", 
    "../../../assets/prelude.mp3",
    "https://musescore.com/classicman/scores/1444781"),
  new SamplePerformance("Sonate No. 14 Moonlight 3rd Movement", 
    "../../../assets/sonate.mp3",
    "https://musescore.com/classicman/scores/33715"),
  new SamplePerformance("Prélude Opus 28 No. 4 in E Minor", 
    "../../../assets/opus.mp3",
    "https://musescore.com/user/19710/scores/65474"),
  new SamplePerformance("Piano Sonata No. 11 K. 331 3rd Movement", 
    "../../../assets/rondo.mp3",
    "https://musescore.com/classicman/scores/49143"),
];

export class App extends React.Component {

  audio = null;

  sampleSongs: {};

  state = {
    selectedFile: null,
    performanceMidi: null,
    performanceWav: null,
    citationUrl: null,
    displayedFileName: defaultDisplayedFileName,
    toolInterfaceStyle : toolInterfaceStyleInitial,
    toolProgressStyle : toolProgressInterfaceStyleInitial,
    toolPlayerStyle : toolPlayerInterfaceStyleInitial,
    sampleSongDropdown: {},
  };

  constructor(){
    super();
  }

  // Executed only once upon startup.
  componentDidMount(){
    // Disable dragging for background image.
    let imageElement = document.getElementById('mainBackgroundImg');
    imageElement.ondragstart = function() { return false; };
    imageElement.oncontextmenu = function() { return false; };

    // Populate sample songs. Populate dropdown. 
    let newSampleSongs = {};
    let newSampleSongsDropdown = defaultDisplayedSamplePerformance;
    for(var i =0; i < sampleSongObjects.length;i++){
      let samplePerformance = sampleSongObjects[i];
      let songName = samplePerformance.songName;
      newSampleSongs[songName] = samplePerformance; 
      newSampleSongsDropdown[songName] = songName;
    };
    this.setState({
      sampleSongDropdown : newSampleSongsDropdown
    });
    this.sampleSongs = newSampleSongs
  }

  // When the user has selected to load a sample performance. 
  async onPreloadedSelect(evt){
    await this.setState({
      performanceWav: this.sampleSongs[evt.target.value].src,
      selectedFile: evt.target.value,
      displayedFileName: evt.target.value,
      citationUrl: this.sampleSongs[evt.target.value].hyperlink,
    });
    this.showToolPlayer();
  }

  // When the user has selected a new file. Kick off song performance.
  onFileChange = async event => {
    await this.setState({
      selectedFile: event.target.files[0],
      displayedFileName: event.target.files[0].name
    })
    await this.onPerformSong()
  };

  // Stop any existing audio
  async resetTool() {
    await this.setState({
      displayedFileName: defaultDisplayedFileName,
      selectedFile: null,
      performanceMidi: null,
      performanceWav: null,
      citationUrl: null,
    });
    var player = document.getElementById("audioPlayer") as HTMLAudioElement;
    player.pause();
    this.showTool();
  }

  // When the user submits a file. 
  onPerformSong = () => {
    // First, verify that the file is a MIDI. 
    if(this.state.selectedFile == null){
      alert("Please select a file (.midi or .mid) to perform!\n\nAlternatively, choose a saved performance to listen to.");
      return
    }
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

        if(response.status != 200)
        {
          console.log("[ERROR] Exception occured during the performance! Response:");
          console.log(response);
          alert("Sorry, something went wrong during the performance!\n\nPlease try another song or try again later.");
          this.resetTool();
        }

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
          performanceWav: "data:audio/mp3;base64," + data['1']
        })
        this.showToolPlayer();
      };
      reader.readAsBinaryString(this.state.selectedFile)
    }
    catch(e){
      console.log("[ERROR] Exception occured during the performance! Exception:");
      console.log(e);
      alert("Sorry, something went wrong during the performance!\n\nPlease try another song or try again later.");
      this.resetTool();
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

            <div id="toolInterfacePreloaded">
                <select id="toolInterfacePreloadedSelect" default="" onChange={evt => this.onPreloadedSelect(evt)}>
                  {Object.keys(this.state.sampleSongDropdown).map((x,y) => <option key={y}>{x}</option>)}
                </select>
                <button id="toolInterfaceButtonPerform2" onClick={this.onPerformSong}>Play Song</button>
              </div>

              <div id="toolInterfaceOr">
                Or
              </div>

              <div id="toolInterfaceMidi">
                <label class="custom-file-upload">
                  <div id="toolInterfaceInputFilename">
                    <span id="toolInterfaceInputFilenameInner">
                      {this.state.displayedFileName}
                    </span>
                  </div>
                  <input type="file" id="toolInterfaceInput" onChange={this.onFileChange} />
                </label>
                <button id="toolInterfaceButtonPerform" onClick={this.onPerformSong}>Upload Midi</button>
              </div>

            </div>
          </div>
        </div>

        <div id="toolProgress">
          <div id="toolProgressInner">
            <div id="toolProgressInterface" style={this.state.toolProgressStyle}>
              <div id="toolProgressInterfaceText">
                <span>Performing <i>{this.state.displayedFileName.replace(".mid", "").replace(".midi", "").replace("_", " ")}...</i></span>
              </div>
            </div>
          </div>
        </div>

        <div id="toolPlayer">
          <div id="toolPlayerInner">
            <div id="toolPlayerInterface" style={this.state.toolPlayerStyle}>
              <div id="toolPlayerInterfaceTitle">
                <span>Now Performing: <a href={this.state.citationUrl} target="_blank"><i>{this.state.displayedFileName.replace(".mid", "").replace(".midi", "").replace("_", " ")}</i></a>
                </span>
              </div>
              <div id="toolPlayerInterfaceAudio">
                <audio id="audioPlayer" controls src={this.state.performanceWav} 
                  title={this.state.displayedFileName.replace(".mid", "").replace(".midi", "") + ".mp3"}>
                  Error encountered - please report this! 
                </audio>
              </div>
              <div id="toolPlayerInterfacePerformance">
                <a id="toolPlayerInterfaceButtonSaveMp3Outer" href={this.state.performanceWav}
                  download={this.state.displayedFileName.replace(".mid", "").replace(".midi", "") + ".mp3"}>
                  <button id="toolPlayerInterfaceButtonSaveMp3" >Download Mp3</button>
                </a>
                <button id="toolPlayerInterfaceButtonSaveMidi">Download Midi</button>
              </div>
              <div id = "toolPlayerInterfaceReturn">
                <button id="toolPlayerInterfaceReturnButton" onClick={this.resetTool.bind(this)}>
                  Perform Another Song...
                </button>
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