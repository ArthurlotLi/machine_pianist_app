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
  width: "min(90%, 600px)",
  margin: "0 auto",
  height: "fit-content",
  display: "block",
  visibility: "visible",
  pointerEvents: "auto",
  overflow: "hidden",
  padding: "5px",
};

const toolProgressInterfaceStyleInitial = {
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "var(--secondary-color)",
  width: "min(90%, 600px)",
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
  width: "min(90%, 600px)",
  margin: "0 auto",
  height: "fit-content",
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
  overflow: "hidden",
  padding: "5px",
};

const mainPlayerStyleInitial = {
  display: "block",
  visibility: "visible",
  pointerEvents: "auto",
}
const aboutStyleInitial = {
  display: "none",
  visibility: "hidden",
  pointerEvents: "none",
}

const defaultDisplayedFileName = "Choose a MIDI file to perform...";
const defaultDisplayedSamplePerformance = { "-- Select sample --": ""}

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
  new SamplePerformance("Emperor's New Clothes", 
    "../../../assets/emperor.mp3",
    "https://musescore.com/user/32136986/scores/6536649"),
  new SamplePerformance("Say Amen", 
    "../../../assets/say amen.mp3",
    "https://musescore.com/user/32136986/scores/6535471"),
  new SamplePerformance("No Time to Die", 
    "../../../assets/no time to die.mp3",
    "https://musescore.com/user/22869211/scores/6081588"),
  new SamplePerformance("Seven Nation Army", 
    "../../../assets/seven nation army.mp3",
      "https://musescore.com/user/27050094/scores/4835229"),
  new SamplePerformance("House of Memories", 
    "../../../assets/house of memories.mp3",
    "https://musescore.com/user/16240686/scores/3366501"),
  new SamplePerformance("Take Me to Church", 
    "../../../assets/church.mp3",
    "https://musescore.com/user/1055536/scores/3974821"),
  new SamplePerformance("My Future", 
    "../../../assets/my future.mp3",
    "https://musescore.com/user/21066206/scores/6279281"),
  new SamplePerformance("Victorious", 
    "../../../assets/victorious.mp3",
    "https://musescore.com/user/1010896/scores/1379111"),
  new SamplePerformance("Shape of You", 
    "../../../assets/shape of you.mp3",
    "https://musescore.com/user/3435661/scores/3798956"),
  new SamplePerformance("Shivers", 
    "../../../assets/shivers.mp3",
    "https://musescore.com/user/1842796/scores/7073158"),
  new SamplePerformance("Radioactive", 
    "../../../assets/radioactive.mp3",
    "https://musescore.com/user/12677026/scores/3924896"),
  new SamplePerformance("Hotel California", 
    "../../../assets/hotel california.mp3",
    "https://musescore.com/user/1842796/scores/7696946"),
  new SamplePerformance("Dream On", 
    "../../../assets/dream on.mp3",
    "https://musescore.com/user/36070839/scores/6811642"),
  new SamplePerformance("As the World Caves In", 
    "../../../assets/world caves in.mp3",
    "https://musescore.com/user/34899578/scores/6109689"),
  new SamplePerformance("Megalovania", 
    "../../../assets/megalovania.mp3",
    "https://musescore.com/user/2315121/scores/1673431"),
  new SamplePerformance("The Night King", 
    "../../../assets/night king.mp3",
    "https://musescore.com/user/11989916/scores/5549583"),
  new SamplePerformance("My Castle Town", 
    "../../../assets/castle.mp3",
    "https://musescore.com/user/34759039/scores/7017953"),
  new SamplePerformance("Attack of the Killer Queen", 
    "../../../assets/queen.mp3",
    "https://musescore.com/user/8284836/scores/7021628"),
  new SamplePerformance("Big Shot", 
    "../../../assets/big shot.mp3",
    "https://musescore.com/user/6765551/scores/7021713"),
  new SamplePerformance("Rush E (Duet)", 
    "../../../assets/rush.mp3",
    "https://musescore.com/user/38680685/scores/7024059"),
  new SamplePerformance("Wolven Storm", 
    "../../../assets/wolven storm.mp3",
    "https://musescore.com/user/1147571/scores/1075896"),
  new SamplePerformance("Those Who Fight", 
    "../../../assets/those who fight.mp3",
    "https://musescore.com/user/33971546/scores/6782289"),
  new SamplePerformance("Daredevil (Duet)", 
    "../../../assets/daredevil.mp3",
    "https://musescore.com/user/121033/scores/7292981"),
  new SamplePerformance("Mii Channel", 
    "../../../assets/channel.mp3",
    "https://musescore.com/user/1801321/scores/3556616"),
  new SamplePerformance("Gerudo Valley (Duet)", 
    "../../../assets/valley.mp3",
    "https://musescore.com/user/8784906/scores/3563316"),
  new SamplePerformance("Hyrule Field", 
    "../../../assets/field.mp3",
    "https://musescore.com/user/4441236/scores/2190836"),
  new SamplePerformance("The Shire", 
    "../../../assets/shire.mp3",
    "https://musescore.com/denburel/scores/4192636"),
  new SamplePerformance("Melody of Water (Duet)", 
    "../../../assets/water.mp3",
    "https://musescore.com/shadowtenshii/scores/5082965"),
  new SamplePerformance("Deepest Woods", 
    "../../../assets/deepest woods.mp3",
    "https://musescore.com/user/36763129/scores/6512336"),
  new SamplePerformance("Raindrop Flower", 
    "../../../assets/raindrop.mp3",
    "https://musescore.com/user/26970134/scores/4815210"),
  new SamplePerformance("Chance Meeting with Myself", 
    "../../../assets/chance.mp3",
    "https://musescore.com/user/5771531/scores/5069419"),
  new SamplePerformance("Grant's Etude", 
    "../../../assets/blue brown.mp3",
    "https://musescore.com/user/3448751/scores/6091506"),
  new SamplePerformance("Waltz in A Minor", 
    "../../../assets/waltz.mp3",
    "https://musescore.com/user/4609986/scores/1749181"),
  new SamplePerformance("Prélude No. 14 BWV 883", 
    "../../../assets/prelude.mp3",
    "https://musescore.com/classicman/scores/1444781"),
  new SamplePerformance("Sonate No. 14 Moonlight", 
    "../../../assets/sonate.mp3",
    "https://musescore.com/classicman/scores/33715"),
  new SamplePerformance("Prélude Opus 28 No. 4", 
    "../../../assets/opus.mp3",
    "https://musescore.com/user/19710/scores/65474"),
  new SamplePerformance("Sonata No. 11 3rd Movement", 
    "../../../assets/rondo.mp3",
    "https://musescore.com/classicman/scores/49143"),
  new SamplePerformance("Clair de Lune", 
    "../../../assets/clair de lune.mp3",
    "https://musescore.com/user/19710/scores/58553"),
];

export class App extends React.Component {

  audio = null;

  sampleSongs: {};

  state = {
    selectedFile: null,
    performanceMidi: null,
    performanceWav: null,
    citationUrl: null,
    showingAbout: false,
    displayedFileName: defaultDisplayedFileName,
    toolInterfaceStyle : toolInterfaceStyleInitial,
    toolProgressStyle : toolProgressInterfaceStyleInitial,
    toolPlayerStyle : toolPlayerInterfaceStyleInitial,
    mainPlayerStyle : mainPlayerStyleInitial,
    aboutStyle: aboutStyleInitial,
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

    // Populate sample songs. Populate dropdown. Also populate the
    // about page list. 
    let aboutInfoTextSongs = document.getElementById('aboutInfoTextSongs');
    let aboutInfoDivs = [];
    let newSampleSongs = {};
    let newSampleSongsDropdown = defaultDisplayedSamplePerformance;
    for(var i =0; i < sampleSongObjects.length;i++){
      let samplePerformance = sampleSongObjects[i];
      let songName = samplePerformance.songName;
      newSampleSongs[songName] = samplePerformance; 
      newSampleSongsDropdown[songName] = songName;

      let newInfoDiv = document.createElement("div");
      let newInfoBold = document.createElement("b");
      let newInfoItalics = document.createElement("i");
      newInfoItalics.innerText = songName
      let newInfoSpan = document.createElement("span");
      newInfoSpan.innerText = " - "
      let newInfoLink = document.createElement("a");
      newInfoLink.href = samplePerformance.hyperlink;
      newInfoLink.innerText = samplePerformance.hyperlink;
      newInfoLink.target = "_blank";
      newInfoBold.appendChild(newInfoItalics);
      newInfoDiv.appendChild(newInfoBold)
      newInfoDiv.appendChild(newInfoSpan)
      newInfoDiv.appendChild(newInfoLink)
      aboutInfoDivs.push(newInfoDiv);
    };
    this.setState({
      sampleSongDropdown : newSampleSongsDropdown
    });
    this.sampleSongs = newSampleSongs

    for(var i=0; i< aboutInfoDivs.length; i ++){
      let div = aboutInfoDivs[i];
      aboutInfoTextSongs.appendChild(div);
    }
  }

  // When the user has selected to load a sample performance. 
  async onPreloadedSelect(evt){
    if(evt.target.value == ""){
      alert("Please select a sample performance to play!");
      return
    }

    await this.setState({
      performanceWav: this.sampleSongs[evt.target.value].src,
      selectedFile: evt.target.value,
      displayedFileName: evt.target.value,
      citationUrl: this.sampleSongs[evt.target.value].hyperlink,
    });
    this.showToolPlayer();
    var player = document.getElementById("audioPlayer") as HTMLAudioElement;
    player.play();
  }

  // When the user has selected a new file. Kick off song performance.
  onFileChange = async event => {
    await this.setState({
      selectedFile: event.target.files[0],
      displayedFileName: event.target.files[0].name
    })
    await this.onPerformSong()
  };

  // When the user wishes to save the midi of this current performance. 
  async onSaveMidi() {
    if(this.state.citationUrl != null) {
      // To be safe, let's not allow users to download MIDIs of our
      // sample performances from this website. 
      let a= document.createElement('a');
      a.target= '_blank';
      a.href= this.state.citationUrl;
      a.click();
      a.remove();
    }
    else{
      if(this.state.performanceMidi == null){
        alert("Please select a file (.midi or .mid) to perform!");
        return
      }

      var byteCharacters = atob(this.state.performanceMidi);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      
      // Otherwise, allow users to save the midi file. 
      var blob = new Blob([byteArray], {type: "application/octet-stream"});
      var fileName = this.state.displayedFileName.replace(".mid", "").replace(".midi", "") + ".mid";
      
      var url = window.URL.createObjectURL(blob);

      var anchorElem = document.createElement("a");
      anchorElem.href = url;
      anchorElem.download = fileName;
      anchorElem.click();
      anchorElem.remove();

      // On Edge, revokeObjectURL should be called only after
      // a.click() has completed, atleast on EdgeHTML 15.15048
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 1000);
    }
  }

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

    var selection = document.getElementById("toolInterfaceInput") as HTMLInputElement;
    selection.value = null;

    var preloadSelect = document.getElementById("toolInterfacePreloadedSelect") as HTMLSelectElement
    preloadSelect.selectedIndex = 0
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
          body: JSON.stringify({ 
            "midi": encodedString, 
            "generate_wav" : "1", 
            "filename" : this.state.displayedFileName.replace(".mid", "").replace(".midi", "") 
          })
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
        //let performanceMidi = Buffer.from(data['0'], "base64").toString('binary');
        this.setState({
          performanceMidi: data['0']
        })
        this.setState({
          performanceWav: "data:audio/mp3;base64," + data['1']
        })
        this.showToolPlayer();
        var player = document.getElementById("audioPlayer") as HTMLAudioElement;
        player.play();
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

  toggleAbout() {
    var modifiedMainPlayer = Object.assign({}, this.state.mainPlayerStyle);
    var modifiedAbout = Object.assign({}, this.state.aboutStyle);

    if(this.state.showingAbout){
      modifiedMainPlayer["display"] = "block";
      modifiedMainPlayer["visibility"] = "visible";
      modifiedMainPlayer["pointerEvents"] = "auto";
      modifiedAbout["display"] = "none";
      modifiedAbout["visibility"] = "hidden";
      modifiedAbout["pointerEvents"] = "none";

      this.setState({
        mainPlayerStyle : modifiedMainPlayer,
        aboutStyle : modifiedAbout,
        showingAbout: false,
      });
    }
    else {
      modifiedAbout["display"] = "block";
      modifiedAbout["visibility"] = "visible";
      modifiedAbout["pointerEvents"] = "auto";
      modifiedMainPlayer["display"] = "none";
      modifiedMainPlayer["visibility"] = "hidden";
      modifiedMainPlayer["pointerEvents"] = "none";

      this.setState({
        mainPlayerStyle : modifiedMainPlayer,
        aboutStyle : modifiedAbout,
        showingAbout: true,
      });
    }
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
              <button id="aboutButton" onClick={this.toggleAbout.bind(this)}>{this.state.showingAbout ? "Main Page" : "About"}</button>
            </div>
          </div>
        </div>

        <div id="mainPlayer" style={this.state.mainPlayerStyle}>

          <div id="tool">
            <div id="toolInner">
              <div id="toolInterface" style={this.state.toolInterfaceStyle}>

                <div id="toolInterfacePreloaded">
                  <div  id="toolInterfacePreloadedSelectDiv">
                    <select id="toolInterfacePreloadedSelect" default="" onChange={evt => this.onPreloadedSelect(evt)}>
                      {Object.keys(this.state.sampleSongDropdown).map((x,y) => <option key={y}>{x}</option>)}
                    </select>
                  </div>
                  <div id="toolInterfaceButtonPerform2Div">
                    <button id="toolInterfaceButtonPerform2" onClick={this.onPreloadedSelect}>Listen</button>
                  </div>
                </div>

                <div id="toolInterfaceOr">
                  <hr></hr>
                </div>

                <div id="toolInterfaceMidi">
                  <label class="custom-file-upload">
                    <div id="toolInterfaceInputFilename">
                      <span id="toolInterfaceInputFilenameInner">
                        {this.state.displayedFileName}&emsp;
                      </span>
                    </div>
                    <input type="file" id="toolInterfaceInput" onChange={this.onFileChange} />
                  </label>
                  <button id="toolInterfaceButtonPerform" onClick={this.onPerformSong}>Upload MIDI</button>
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
                    <button id="toolPlayerInterfaceButtonSaveMp3" >Download MP3</button>
                  </a>
                  <button id="toolPlayerInterfaceButtonSaveMidi" onClick={this.onSaveMidi.bind(this)}>
                    {this.state.citationUrl == null ? "Download MIDI" : "Visit Source" }
                  </button>
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
              
              <div id="infoText">
                <h2>Perform your MIDI file with Artificial Intelligence</h2>

                <div>This website provides the trained Machine Pianist model for public use. 
                  Piano MIDI files <b>(.midi or .mid)</b> may be submitted to be played by the model, with the resulting performance being downloadable in both <b>MP3</b> and <b>MIDI</b> formats. 
                </div>

                <br/>

                <div>
                  Feel free to experiment, and see how the Machine Pianist stylizes your own arrangements! 
                </div>

                <br/>

                <hr/>

                <div id="charts">
                  <img class="chartImg" src={require("../../../assets/chart1.png").default}/>
                  <img id="chart2Img" class="chartImg" src={require("../../../assets/chart2.png").default}/>
                  <img id="chart3Img" class="chartImg" src={require("../../../assets/chart3.png").default}/>
                </div>

                <hr/>

                <h2>Using Machine Learning to emulate human pianists</h2>

                <div>How does a human play sheet music of a song that they've never heard before? </div>

                <br/>

                <div>This AI-powered tool was created under the hypothesis that machine learning can encapsulate human tendencies in performing piano songs. 
                  The final model, trained for weeks with the performances of expert musicians, is able to synthesize some of the key "humanizing" components of a live performance.
                  These aspects include:</div>

                <br/>
                <div>1. Variable velocity of notes when pressed</div>
                <div>2. Choice of sustain pedal positions throughout a piece</div>
                <br/>

                <div>
                  Piano playing software in online websites, installed applications, and shipped pianos simply follow instructions to the letter, without making such subjective choices.
                  As such, these performances may sound robotic and unnatural at times, without the flowing nuance of a trained musician. 
                  The task for this project was thus: 
                </div>

                <br/>
                  
                <div>Given an <b>arbitrary piano piece</b>, predict <b>key velocities</b> and <b>sustain pedal positions</b> to produce a more human-sounding performance.</div>

                <br/>

                <hr/>

                <div id="charts">
                  <img class="chartImg" src={require("../../../assets/chart4.png").default}/>
                  <img id="chart2Img" class="chartImg" src={require("../../../assets/chart5.png").default}/>
                  <img id="chart3Img" class="chartImg" src={require("../../../assets/chart6.png").default}/>
                </div>

                <hr/>
                
              </div>

            </div>
          </div>
        </div>

        <div id="aboutPage" style={this.state.aboutStyle}>

          <div id="aboutContact">
            <div id="aboutContactInner">
              <div id="aboutContactInterface">
                <div id="aboutContactInterfacePhoto">
                  <img id="aboutContactInterfaceImg" src={require("../../../assets/about.jpg").default}/> 
                </div>
                <div id="aboutContactInterfaceInfo">
                  <div id="aboutContactInterfaceTitle">
                    <span>Arthurlot Li</span>
                  </div>
                  <div id="aboutContactInterfaceSubtitle"><i>Machine Learning Practitioner</i></div>

                  <br/>
                  <br/>

                  <div id="aboutContactInterfaceText">
                    <div id="aboutContactInterfaceTextInner">
                      <div>Please feel free to contact me:</div>

                      <div><a href="mailto:ArthurlotLi@gmail.com">ArthurlotLi@gmail.com</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div id="aboutInfo">
            <div id="aboutInfoInner">

              <div id="aboutInfoText">
                <div>
                  <h2>Work Citations:</h2>

                  <div>
                    <b>MAESTRO Dataset</b> - <a target="_blank" href="https://magenta.tensorflow.org/datasets/maestro">https://magenta.tensorflow.org/datasets/maestro</a>
                    <div>Published Paper (2019): <a target="_blank" href="https://arxiv.org/abs/1810.12247">https://arxiv.org/abs/1810.12247</a></div>
                    <p>
                    <div>Curtis Hawthorne, Andriy Stasyuk, Adam Roberts, Ian Simon, Cheng-Zhi Anna Huang,</div>
                    <div>&emsp;Sander Dieleman, Erich Elsen, Jesse Engel, and Douglas Eck. "Enabling</div>
                    <div>&emsp;Factorized Piano Music Modeling and Generation with the MAESTRO Dataset."</div>
                    <div>&emsp;In International Conference on Learning Representations, 2019.</div>
                    </p>
                  </div>

                  <hr/>

                  <div>
                    <b>Free Pats, Upright Piano KW Soundfont</b> - <a target="_blank" href="https://freepats.zenvoid.org/">https://freepats.zenvoid.org/</a>
                  </div>

                  <br/>

                  <div id="aboutInfoTextSongs">
                  </div>

                  <br/>


                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  };
}

ReactDOM.render(<App />, document.getElementById('app'));