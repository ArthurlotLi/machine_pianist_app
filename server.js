/*
  server.js
  
  Primary file for our node.js express web application.
*/

const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const listeningPort = 8080;

// Create the app
const app = express();

// Location of the 
const cloudInferenceServerIp = "http://192.168.0.148"
const cloudInferenceServerPort = 9121

/*
  Web Application logic
*/

// Whenever the request path has "static" inside of it, simply serve 
// the static directory as you'd expect. 
app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

// To support parsing of JSON objects in both body and url. 
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Accept requests to play piano songs. Simple proxy middleware.
app.post('/performMidi', async (req, res) => {
  console.log("[DEBUG] /performMidi POST request received. Body length: " + JSON.stringify(req.body).length);
  if(req.body.midi != null && req.body.generate_wav != null) {
    var startTime = performance.now();
    try{
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "midi": req.body.midi, "generate_wav" : req.body.generate_wav })
      };
      const response = await fetch(cloudInferenceServerIp + ":" + cloudInferenceServerPort + "/performMidi", requestOptions);
      var endTime = performance.now();
      var totalTime = (endTime - startTime)/1000;
      console.log(`[DEBUG] Cloud Inference round-trip time: ${totalTime}`)

      const data = await response.json();
      if (response.status == 200 && data['0'] != null){
        res.writeHead(200, { "Content-Type" : "application/json"});
        res.write(JSON.stringify(data));
        res.send();
      }
      else{
        return res.status(response.status).send();
      }
    }
    catch(e){
      console.log("[ERROR] /performMidi forwarding failed. Error: ", e)
      return res.status(400).send();
    }
  }
});

// For the main (and only) page, serve the web application to the client. 
app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start the server to listen on this port.
app.listen(listeningPort, () => {
  console.log("Project KotakeeOS is online at port: " +listeningPort);
});
