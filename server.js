/*
  server.js
  
  Primary file for our node.js express web application.
*/

const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
var session = require('express-session')
//const proxy = require("http-proxy-middleware");

const listeningPort = 80;

// Create the app
const app = express();

// Location of the Cloud Inference Server. 
const cloudInferenceServerURL = "http://192.168.0.148:9121"

/*
  Web Application logic
*/

// Note... this HAS to come before /static. 
/*
app.use('/cloudInference', proxy.createProxyMiddleware({
  target: cloudInferenceServerURL,
  changeOrigin: true,
  pathRewrite: {
    [`/cloudInference`]: '',
  },  
}))*/

// Basic user statistics
var uniqueSessions = 0;
var views = 0;
var submittedMidis = 0;

// Whenever the request path has "static" inside of it, simply serve 
// the static directory as you'd expect. 
app.use("/static", express.static(path.resolve(__dirname, "public", "static")));
// Serve all assets. 
app.use("/assets", express.static(path.join(__dirname, "assets")));

// To support parsing of JSON objects in both body and url. 
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({
  extended: true
}));

// Session Setup
app.use(session({
  // Secrete key for the session.
  secret: 'machine pianist cat',
  resave: false,
  // Forces a session that is "uninitialized"
  // to be saved to the store
  saveUninitialized: true,
  cookie: { secure: false }
}))

const log_statistics = function(){
  console.log(`[INFO] ${new Date().toISOString()} | Unique Sessions: ${uniqueSessions} | Views: ${views} | Midis: ${submittedMidis}`)
}

// Alternative to proxy middleware.
 
app.post('/cloudInference/performMidi', async (req, res) => {
  submittedMidis++;
  console.log("[DEBUG] /performMidi POST request received. Body length: " + JSON.stringify(req.body).length);
  if(req.body.midi != null && req.body.generate_wav != null) {
    var startTime = performance.now();
    try{
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "midi": req.body.midi, "generate_wav" : req.body.generate_wav, "filename" : req.body.filename})
      };
      const response = await fetch(cloudInferenceServerURL + "/performMidi", requestOptions);
      var endTime = performance.now();
      var totalTime = (endTime - startTime)/1000;
      console.log(`[DEBUG] Cloud Inference round-trip time: ${totalTime}`)

      var startTime = performance.now();
      const data = await response.json();
      if (response.status == 200 && data['0'] != null){
        res.writeHead(200, { "Content-Type" : "application/json"});
        res.write(JSON.stringify(data));
        res.send();
        var endTime = performance.now();
        var totalTime = (endTime - startTime)/1000;
        console.log(`[DEBUG] Cloud Inference reponse forwarding time: ${totalTime}`)
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
  log_statistics();
});

// For the main (and only) page, serve the web application to the client. 
app.get('/',(req,res) => {
  views++;
  if (req.session.views) {
    // Old session. 
    req.session.views++
  } 
  else{
    // New session has started
    uniqueSessions++;
    req.session.views = 1;
  }
  log_statistics();
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start the server to listen on this port.
app.listen(listeningPort, () => {
  console.log("Project Machine Pianist is online at port: " +listeningPort);
});
