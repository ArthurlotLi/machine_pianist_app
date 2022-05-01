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

// For the main (and only) page, serve the web application to the client. 
app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start the server to listen on this port.
app.listen(listeningPort, () => {
  console.log("Project KotakeeOS is online at port: " +listeningPort);
});
