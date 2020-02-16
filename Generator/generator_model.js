/////////////////////////////////////////////////////////////////////////////////
// Node Server Dependencies
/////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const timeout = require('connect-timeout');
const seedrandom = require('seedrandom');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(50);
const port = 3001;

/////////////////////////////////////////////////////////////////////////////////
// Program Constraints
/////////////////////////////////////////////////////////////////////////////////
const inputTime = 10000;
const outputTime = 5000;
const statusTime = 5000;
const serverSize = 3001;
const startEfficiency = 0.5;
const efficiencyJump = 0.25;
const PowerConstant = 3.409;

var rng = [];
var input = [];
var output = [];
var inputEmitters = [];
var outputEmitters = [];
var connections = [];


/////////////////////////////////////////////////////////////////////////////////
// Server Dependencies and Memory
/////////////////////////////////////////////////////////////////////////////////
input.length = serverSize;
output.length = serverSize;
inputEmitters.length = serverSize;
outputEmitters.length = serverSize;
rng.length = serverSize*2;

for (i = 0; i < serverSize*2; i++){
  rng[i] = seedrandom(i);
  if(i < serverSize) {
    connection = [];
    connections.push(connection);
    inputEmitters[i] = null;
    outputEmitters[i] = null;
    output[num] = 0.5;
    input[num] = 0.5;
  }
}

/////////////////////////////////////////////////////////////////////////////////
// Server Status Log
/////////////////////////////////////////////////////////////////////////////////
setInterval(function() {
  in_count = 0;
  out_count = 0;
  connection_count = 0;
  for(i = 0; i < serverSize; i++){
    if(inputEmitters[i] != null) in_count++;
    if(outputEmitters[i] != null) out_count++;
    for(j = 0; j < connections[i].length; j++){
      connection_count++;
    }
  }
  console.log("Input Listeners Logged: " + in_count);
  console.log("Output Listeners Logged: " + out_count);
  console.log("Connections Logged: " + connection_count);
}, statusTime);

/////////////////////////////////////////////////////////////////////////////////
// Helper Functions
/////////////////////////////////////////////////////////////////////////////////
function setOutboundEmitter(num) {
  output[num] += (efficiencyJump * 2 * rng[num + 3000]() - efficiencyJump);
  if(output[num] > input[num])
    output[num] = input[num];
  if(output[num] < 0.0)
    output[num] = 0.0;
  output[num] = powerConstant * output[num];
  myEmitter.emit('generator output ' + num, arguments.callee);
  return;
}

function setInboundEmitter(num) {
  input[num] += (efficiencyJump * 2 * rng[num]() - efficiencyJump);
  if(input[num] < 0.0)
    input[num] = 0.0;
  myEmitter.emit('generator input ' + num, arguments.callee);
  return;
}

function closeConnection(num) {
  connections[num].pop();
  if(connections[num].length == 0) {
    if (inputEmitters[num] !== null) {
      clearInterval(inputEmitters[num]);
      myEmitter.removeListener('generator input ' + num, arguments.callee);
      inputEmitters[num] = null;
    }
    if(outputEmitters[num] !== null) {
      clearInterval(outputEmitters[num]);
      myEmitter.removeListener('generator output ' + num, arguments.callee);
      outputEmitters[num] = null;
    }
  }
  return;
}

function setHead(res, streaming){
  res.status(200)
  if(streaming){
    res.set({
      'Connection' : 'keep-alive',
      'Content-Type' : 'text/event-stream',
      'Cache-Control' : 'no-cache',
      'Access-Control-Allow-Origin' : '*',

    })
  } else {
    res.set({
      'Content-Type' : 'application/json',
    })
  }
}

function sendResponse(res, data, streaming) {
  if(streaming) res.write(JSON.stringify(data));
  else res.send('data: ' + JSON.stringify(data) + '\n\n');
}

/////////////////////////////////////////////////////////////////////////////////
// Data Setters
/////////////////////////////////////////////////////////////////////////////////
function setFuelInformation(req, res, num){
  data = {}
  queries = req.query["id"];
  if (queries == null){
    data.generator = num;
    data.time = new Date().toISOString();
    data.fuelConsumed = input[num]*3.4;
    sendResponse(res, data, true);
    return;
  }
  if (typeof queries == 'string') {
    if(queries.toLowerCase().includes('generator')) data.generator = num;
    if(queries.toLowerCase().includes('time')) data.time = new Date().toISOString();
    if(queries.toLowerCase().includes('fuelconsumed') || queries.toLowerCase().includes('input')) data.fuelConsumed = input[num];
    sendResponse(res, data, true);
    return;
  }
  for(i = 0; i < queries.length; i++){
    if(queries[i].toLowerCase().includes('generator')) data.generator = num;
    if(queries[i].toLowerCase().includes('time')) data.time = new Date().toISOString();
    if(queries[i].toLowerCase().includes('fuelconsumed') || queries.toLowerCase().includes('input')) data.fuelConsumed = input[num];
  }
  sendResponse(res, data, true);
  return;
}

function setPowerInformation(req, res, num){
  data = {}
  queries = req.query["id"];
  if (queries == null){
    data.generator = num;
    data.time = new Date().toISOString();
    data.powerProduced = output[num];
    sendResponse(res, data, true);
    return;
  }
  if (typeof queries == 'string') {
    if(queries.toLowerCase().includes('generator')) data.generator = num;
    if(queries.toLowerCase().includes('time')) data.time = new Date().toISOString();
    if(queries.toLowerCase().includes('powerproduced') || queries.toLowerCase().includes('output')) data.powerProduced = output[num];
    sendResponse(res, data, true);
    return;
  }
  for(i = 0; i < queries.length; i++){
    if(queries[i].toLowerCase().includes('generator')) data.generator = num;
    if(queries[i].toLowerCase().includes('time')) data.time = new Date().toISOString();
    if(queries[i].toLowerCase().includes('powerproduced') || queries.toLowerCase().includes('output')) data.powerProduced = output[num];
  }
  sendResponse(res, data, true);
  return;
}

/////////////////////////////////////////////////////////////////////////////////
// Server Routes
/////////////////////////////////////////////////////////////////////////////////
app.get('/generator/:generatorID', function (req, res) {
  setHead(res, true);
  let num = parseInt(req.params["generatorID"], 10)
  if (inputEmitters[num] == null) inputEmitters[num] = setInterval(function() { setInboundEmitter(num); }, inputTime);
  if (outputEmitters[num] == null) outputEmitters[num] = setInterval(function() { setOutboundEmitter(num); }, outputTime);
  connections[num].push(1);
  connections[num].push(1);
  myEmitter.on('generator input ' + num, function() { setFuelInformation(req, res, num); });
  myEmitter.on('generator output ' + num, function() { setPowerInformation(req, res, num); });
  req.connection.on('close', function() { closeConnection(num); });
  req.connection.on('close', function() { closeConnection(num); });
})

app.get('/generator/:generatorID/fuelConsumed', function (req, res) {
  setHead(res, true);
  let num = parseInt(req.params["generatorID"], 10)
  if (inputEmitters[num] == null) inputEmitters[num] = setInterval(function() { setInboundEmitter(num); }, inputTime);
  connections[num].push(1);
  myEmitter.on('generator input ' + num, function() { setFuelInformation(req, res, num); });
  req.connection.on('close', function() { closeConnection(num); });
})

app.get('/generator/:generatorID/powerProduced', function (req, res) {
  setHead(res, true);
  let num = parseInt(req.params["generatorID"], 10)
  if (outputEmitters[num] == null) outputEmitters[num] = setInterval(function() { setOutboundEmitter(num); }, outputTime);
  connections[num].push(1);
  myEmitter.on('generator output ' + num, function() { setPowerInformation(req, res, num); });
  req.connection.on('close', function() { closeConnection(num); });
})

/////////////////////////////////////////////////////////////////////////////////
// Start Server
/////////////////////////////////////////////////////////////////////////////////
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));

/////////////////////////////////////////////////////////////////////////////////
// Testing Paths and Functions
/////////////////////////////////////////////////////////////////////////////////
function setServerInformation(req, res){
  data = {}
  data.url = 'Server Information'
  data.queryRequest = req.query
  return data
}

function setGeneratorInformation(req, res){
  data = {}
  data.url = 'Generator Infomation'
  data.queryRequest = req.query
  return data
}

app.get('/', function (req, res) {
  setHead(res, false);
  data = setServerInformation(req, res);
  sendResponse(res, data, false);
})

app.get('/generator', function (req, res) {
  setHead(res, false);
  data = setGeneratorInformation(req, res);
  sendResponse(res, data, false);
})
