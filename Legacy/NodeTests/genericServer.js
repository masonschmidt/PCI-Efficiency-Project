///////////////////////////////////////////////////////////////////
//Dependencies
///////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const port = 80;
const timeout = require('connect-timeout');

///////////////////////////////////////////////////////////////////
//Function to Determine Head of Response
///////////////////////////////////////////////////////////////////
function setHead(res, streaming){
  res.status(200)
  if(streaming){
    res.set({
      'Connection' : 'keep-alive',
      'Content-Type' : 'application/json',
      'Cache-Control' : 'no-cache'
    })
  } else {
    res.set({
      'Content-Type' : 'application/json',
    })
  }
}

///////////////////////////////////////////////////////////////////
//Function to Send Response
///////////////////////////////////////////////////////////////////
function sendResponse(res, data, streaming) {
  if(streaming) res.write(JSON.stringify(data));
  else res.send(JSON.stringify(data));
}

///////////////////////////////////////////////////////////////////
//Functions to Send Response for Paths
///////////////////////////////////////////////////////////////////
function rootFunc(req, res){
  data = {}
  data.url = "/"
  data.queryRequest = req.query
  return data
}

function generator(req, res){
  data = {}
  data.url = "/generator"
  data.queryRequest = req.query
  return data
}

function generatorgeneratorID(req, res){
  data = {}
  data.url = "/generator/:generatorID"
  data.queryRequest = req.query
  return data
}

function generatorgeneratorIDfuelConsumed(req, res){
  data = {}
  data.url = "/generator/:generatorID/fuelConsumed"
  data.queryRequest = req.query
  return data
}

function generatorgeneratorIDpowerProduced(req, res){
  data = {}
  data.url = "/generator/:generatorID/powerProduced"
  data.queryRequest = req.query
  return data
}

///////////////////////////////////////////////////////////////////
//Path Listeners for Server
///////////////////////////////////////////////////////////////////
app.get("/", function (req, res) {
  setHead(res, false);
  data = rootFunc(req, res);
  sendResponse(res, data, false);
})

app.get("/generator", function (req, res) {
  setHead(res, false);
  data = generator(req, res);
  sendResponse(res, data, false);
})

app.get("/generator/:generatorID", function (req, res) {
  setHead(res, true);
  data = generatorgeneratorID(req, res);
  connection = setInterval(sendResponse, 2000, res, data, true);
  req.connection.on('close',function(){
    clearInterval(connection);
    connection = null;
    res.end();
    res.connection.destroy();
  });
})

app.get("/generator/:generatorID/fuelConsumed", function (req, res) {
  setHead(res, true);
  data = generatorgeneratorIDfuelConsumed(req, res);
  connection = setInterval(sendResponse, 2000, res, data, true);
  req.connection.on('close',function(){
    clearInterval(connection);
    connection = null;
    res.end();
    res.connection.destroy();
  });
})

app.get("/generator/:generatorID/powerProduced", function (req, res) {
  setHead(res, true);
  data = generatorgeneratorIDpowerProduced(req, res);
  connection = setInterval(sendResponse, 2000, res, data, true);
  req.connection.on('close',function(){
    clearInterval(connection);
    connection = null;
    res.end();
    res.connection.destroy();
  });
})

///////////////////////////////////////////////////////////////////
//Makes Server Listen for Clients
///////////////////////////////////////////////////////////////////
app.listen(port, () =>
  console.log(`Server listening on port 127.0.0.1:${port}/!`));
