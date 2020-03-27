/////////////////////////////////////////////////////////////////////////////////
// Program Dependencies
/////////////////////////////////////////////////////////////////////////////////
const http = require("http");
const seedrandom = require('seedrandom');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(50);

/////////////////////////////////////////////////////////////////////////////////
// Program Constraints
/////////////////////////////////////////////////////////////////////////////////
const inputTime = 10000;
const outputTime = 5000;
const serverSize = 3000;
const statusTime = 30000;

var rng = [];
var input = [];
var output = [];
var inputEmitters = [];
var outputEmitters = [];
var connections = [];


/////////////////////////////////////////////////////////////////////////////////
// Build Server Dependencies and Memory
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
function setConnectionToEnd(request, response) {
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain"
  });
  return;
}

function setConnectionToStream(request, response) {
  response.writeHead(200, {
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });
  return;
}

function setOutboundEmitter(num) {
  output[num] = rng[num + 3000]();
  myEmitter.emit('generator output ' + num, arguments.callee);
  return;
}

function setInboundEmitter(num) {
  input[num] = rng[num]();
  myEmitter.emit('generator input ' + num, arguments.callee);
  return;
}

function closeConnection(request, response, num) {
  connections[num].pop();
  if(connections[num].length == 0) {
    if (inputEmitters[num] !== null) {
      clearInterval(inputEmitters[num]);
      myEmitter.removeListener('generator input ' + num, arguments.callee);
      inputEmitters[num] = null;
      response.end();
      response.connection.destroy();
    }
    if(outputEmitters[num] !== null) {
      clearInterval(outputEmitters[num]);
      myEmitter.removeListener('generator output ' + num, arguments.callee);
      outputEmitters[num] = null;
      response.end();
      response.connection.destroy();
    }
  }
  return;
}

function splitURL(string){
  query = string.split('/');
  last = query.pop().split('?');
  if (last.length == 1){
    return [query.concat(last)];
  }
  query = query.concat(last);
  return [query.pop(), query];
}


/////////////////////////////////////////////////////////////////////////////////
// Fuel Response
/////////////////////////////////////////////////////////////////////////////////
function inputDataResponse(request, response, num, query_num) {
  response.write("event: message\n");
  if     (query_num == 0) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ', input : ' + input[num] + ' }\n\n');
  else if(query_num == 1) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ', input : ' + input[num] + ' }\n\n');
  else if(query_num == 2) response.write('data: { generator : ' + num + ', input : ' + input[num] + ' }\n\n');
  else if(query_num == 3) response.write('data: { time : ' + Date.now()/1000 + ', input : ' + input[num] + ' }\n\n');
  else if(query_num == 4) response.write('data: { input : ' + input[num] + ' }\n\n');
  else if(query_num == 5) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ' }\n\n');
  else if(query_num == 6) response.write('data: { generator : ' + num + ' }\n\n');
  else                    response.write('data: { time : ' + Date.now()/1000 + ' }\n\n');
  return;
}

function postFuelConsumed(request, response, num, query) {
  setConnectionToStream(request, response);
  if (inputEmitters[num] == null) inputEmitters[num] = setInterval(function() { setInboundEmitter(num); }, inputTime);
  connections[num].push(1);

  data_number = 0;
  if     (query.includes("generator")  && query.includes("time")  && query.includes("input") ) data_number = 0;
  else if(!query.includes("generator") && !query.includes("time") && !query.includes("input")) data_number = 1;
  else if(query.includes("generator")  && !query.includes("time") && query.includes("input") ) data_number = 2;
  else if(!query.includes("generator") && query.includes("time")  && query.includes("input") ) data_number = 3;
  else if(!query.includes("generator") && !query.includes("time") && query.includes("input") ) data_number = 4;
  else if(query.includes("generator")  && query.includes("time")  && !query.includes("input")) data_number = 5;
  else if(query.includes("generator")  && !query.includes("time") && !query.includes("input")) data_number = 6;
  else                                                                                         data_number = 7;

  myEmitter.on('generator input ' + num, function() { inputDataResponse(request, response, num, data_number); });
  request.connection.on('close', function() { closeConnection(request, response, num); });
}


/////////////////////////////////////////////////////////////////////////////////
// Power Response
/////////////////////////////////////////////////////////////////////////////////
function outputDataResponse(request, response, num, query_num) {
  response.write("event: message\n");

  if     (query_num == 0) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ', output : ' + output[num] + ' }\n\n');
  else if(query_num == 1) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ', output : ' + output[num] + ' }\n\n');
  else if(query_num == 2) response.write('data: { generator : ' + num + ', output : ' + output[num] + ' }\n\n');
  else if(query_num == 3) response.write('data: { time : ' + Date.now()/1000 + ', output : ' + output[num] + ' }\n\n');
  else if(query_num == 4) response.write('data: { output : ' + output[num] + ' }\n\n');
  else if(query_num == 5) response.write('data: { generator : ' + num + ', time : ' + Date.now()/1000 + ' }\n\n');
  else if(query_num == 6) response.write('data: { generator : ' + num + ' }\n\n');
  else                    response.write('data: { time : ' + Date.now()/1000 + ' }\n\n');
  return;
}

function postPowerProduced(request, response, num, query) {
  setConnectionToStream(request, response);
  if (outputEmitters[num] == null) outputEmitters[num] = setInterval(function() { setOutboundEmitter(num); }, outputTime);
  connections[num].push(1);
  data_number = 0;
  if     (query.includes("generator")  && query.includes("time")  && query.includes("output") ) data_number = 0;
  else if(!query.includes("generator") && !query.includes("time") && !query.includes("output")) data_number = 1;
  else if(query.includes("generator")  && !query.includes("time") && query.includes("output") ) data_number = 2;
  else if(!query.includes("generator") && query.includes("time")  && query.includes("output") ) data_number = 3;
  else if(!query.includes("generator") && !query.includes("time") && query.includes("output") ) data_number = 4;
  else if(query.includes("generator")  && query.includes("time")  && !query.includes("output")) data_number = 5;
  else if(query.includes("generator")  && !query.includes("time") && !query.includes("output")) data_number = 6;
  else                                                                                          data_number = 7;
  myEmitter.on('generator output ' + num, function() { outputDataResponse(request, response, num, data_number); });
  request.connection.on('close', function() { closeConnection(request, response, num); });
}


/////////////////////////////////////////////////////////////////////////////////
// Fuel and Power Response
/////////////////////////////////////////////////////////////////////////////////
function postFuelAndPower(request, response, num, query) {
  setConnectionToStream(request, response);
  if (inputEmitters[num] == null) inputEmitters[num] = setInterval(function() { setInboundEmitter(num); }, inputTime);
  if (outputEmitters[num] == null) outputEmitters[num] = setInterval(function() { setOutboundEmitter(num); }, outputTime);
  connections[num].push(1);
  connections[num].push(1);
  myEmitter.on('generator input '  + num, function() { inputDataResponse( request, response, num, query); });
  myEmitter.on('generator output ' + num, function() { outputDataResponse(request, response, num, query); });
  request.connection.on('close', function() { closeConnection(request, response, num); });
  request.connection.on('close', function() { closeConnection(request, response, num); });
}


/////////////////////////////////////////////////////////////////////////////////
// Generator Response
/////////////////////////////////////////////////////////////////////////////////
function generatorDataResponse(request, response, query) {
  response.write("event: message\n");
  num = parseInt(query);
  if(num % 5 == 0)      response.write('data: { type : Coal Generator }\n\n');
  else if(num % 5 == 1) response.write('data: { type : Diesel Generator }\n\n');
  else if(num % 5 == 2) response.write('data: { type : Wind Generator }\n\n');
  else if(num % 5 == 3) response.write('data: { type : Hydro Generator }\n\n');
  else if(num % 5 == 4) response.write('data: { type : Nuclear Generator }\n\n');
  else                  response.write('data: { type : Please Specify a Generator }\n\n');
  response.end();
}

function postGeneratorData(request, response, num) {
  setConnectionToEnd(request, response);
  generatorDataResponse(request, response, num);
}


/////////////////////////////////////////////////////////////////////////////////
// Server Response
/////////////////////////////////////////////////////////////////////////////////
function serverDataResponse(request, response, query) {
  response.write("event: message\n");
  if     (query.includes("serverSize")  && query.includes("inputTime")  && query.includes("outputTime") ) response.write('data: { serverSize : ' + serverSize + ', inputTime : ' + inputTime + ', outputTime : ' + outputTime + ' }\n\n');
  else if(!query.includes("serverSize") && !query.includes("inputTime") && !query.includes("outputTime")) response.write('data: { serverSize : ' + serverSize + ', inputTime : ' + inputTime + ', outputTime : ' + outputTime + ' }\n\n');
  else if(query.includes("serverSize")  && !query.includes("inputTime") && query.includes("outputTime") ) response.write('data: { serverSize : ' + serverSize + ', outputTime : ' + outputTime + ' }\n\n');
  else if(query.includes("serverSize")  && query.includes("inputTime")  && !query.includes("outputTime")) response.write('data: { serverSize : ' + serverSize + ', inputTime : ' + inputTime + ' }\n\n');
  else if(query.includes("serverSize")  && !query.includes("inputTime") && !query.includes("outputTime")) response.write('data: { serverSize : ' + serverSize + ' }\n\n');
  else if(!query.includes("serverSize") && query.includes("inputTime")  && query.includes("outputTime") ) response.write('data: { inputTime : ' + inputTime + ', outputTime : ' + outputTime + ' }\n\n');
  else if(!query.includes("serverSize") && !query.includes("inputTime") && query.includes("outputTime") ) response.write('data: { outputTime : ' + outputTime + ' }\n\n');
  else                                                                                                    response.write('data: { inputTime : ' + inputTime + ' }\n\n');
  response.end();
  return;
}

function postServerData(request, response, query) {
  setConnectionToEnd(request, response);
  serverDataResponse(request, response, query);
}


/////////////////////////////////////////////////////////////////////////////////
// Error Response
/////////////////////////////////////////////////////////////////////////////////
function printPathError(request, response, string) {
  response.writeHead(404);
  response.end();
  console.log(string);
}


/////////////////////////////////////////////////////////////////////////////////
// MAIN SERVER
/////////////////////////////////////////////////////////////////////////////////
http.createServer((request, response) => {

  var temp = splitURL(request.url.toLowerCase());
  var last, query;
  if (temp.length == 2) {
    last = temp[0];
    query = temp[1];
  } else {
    query = temp[0];
    last = "";
  }

  if (query[1].toLowerCase() === "generator") {
    if (!isNaN(query[2]) && query[2] !== "") {
      if (query.length > 3) {
        if (query[3] !== "") {
          if (query[3].toLowerCase() === "fuelconsumed") { postFuelConsumed(request, response, parseInt(query[2], 10), last.toLowerCase());
          } else if (query[3].toLowerCase() === "powerproduced") { postPowerProduced(request, response, parseInt(query[2], 10), last.toLowerCase());
          } else { printPathError(request, response, "Fourth path is not fuelconsumed nor powerproduced", parseInt(query[2], 10)); }
        } else { postFuelAndPower(request, response, parseInt(query[2], 10), last.toLowerCase()); }
      } else { postFuelAndPower(request, response, parseInt(query[2], 10), last.toLowerCase()); }
    } else { postGeneratorData(request, response, last); }
  } else { printPathError(request, response, "Base Path is not Testing or Generator!!!"); }
}).listen(5000, () => {
  console.log("Server running at http://127.0.0.1:5000/");
});

/////////////////////////////////////////////////////////////////////////////////
// END PROGRAM
/////////////////////////////////////////////////////////////////////////////////
