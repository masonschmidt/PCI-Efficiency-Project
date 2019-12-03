const fs = require('fs');

var buffer = "";

var path = "genericServer.js";
var port = 3000;

function setHeader(port) {
  buffer =  '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Dependencies\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += 'const express = require(\'express\');\n';
  buffer += 'const app = express();\n';
  buffer += 'const port = ' + port + ';\n';
  buffer += 'const timeout = require(\'connect-timeout\');\n\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Function to Determine Head of Response\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += 'function setHead(res, streaming){\n';
  buffer += '  res.status(200)\n';
  buffer += '  if(streaming){\n';
  buffer += '    res.set({\n';
  buffer += '      \'Connection\' : \'keep-alive\',\n';
  buffer += '      \'Content-Type\' : \'application/json\',\n';
  buffer += '      \'Cache-Control\' : \'no-cache\'\n';
  buffer += '    })\n';
  buffer += '  } else {\n';
  buffer += '    res.set({\n';
  buffer += '      \'Content-Type\' : \'application/json\',\n';
  buffer += '    })\n';
  buffer += '  }\n';
  buffer += '}\n\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Function to Send Response\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += 'function sendResponse(res, data, streaming) {\n';
  buffer += '  if(streaming) res.write(JSON.stringify(data));\n';
  buffer += '  else res.send(JSON.stringify(data));\n';
  buffer += '}\n\n';
  return buffer;
}

function addGetStreamer(buffer, path, relpath) {
  stuff = relpath.replace(":", "");
  stuff = stuff.split("/");
  funcer = "";
  for(j = 0; j < stuff.length; j++){
    funcer += stuff[j];
  }
  if (funcer == ""){
    funcer = relpath;
  }
  buffer += 'app.get("' + path + '", function (req, res) {\n';
  buffer += '  setHead(res, true);\n';
  buffer += '  data = ' + funcer + '(req, res);\n';
  buffer += '  connection = setInterval(sendResponse, 2000, res, data, true);\n';
  buffer += '  req.connection.on(\'close\',function(){\n';
  buffer += '    clearInterval(connection);\n';
  buffer += '    connection = null;\n';
  buffer += '    res.end();\n';
  buffer += '    res.connection.destroy();\n';
  buffer += '  });\n';
  buffer += '})\n\n';
  return buffer;
}

function addGet(buffer, path, relpath) {
  stuff = relpath.replace(":", "");
  stuff = stuff.split("/");
  funcer = "";
  for(j = 0; j < stuff.length; j++){
    funcer += stuff[j];
  }
  if (funcer == ""){
    funcer = relpath;
  }
  buffer += 'app.get("' + path + '", function (req, res) {\n';
  buffer += '  setHead(res, false);\n';
  buffer += '  data = ' + funcer + '(req, res);\n';
  buffer += '  sendResponse(res, data, false);\n';
  buffer += '})\n\n';
  return buffer;
}

function addPathGetResponse(buffer, path, relpath){
  stuff = path.replace(":", "");
  stuff = stuff.split("/");
  funcer = "";
  for(j = 0; j < stuff.length; j++){
    funcer += stuff[j];
  }
  if (funcer == ""){
    funcer = relpath;
  }
  buffer += 'function ' + funcer + '(req, res){\n';
  buffer += '  data = {}\n';
  buffer += '  data.url = "' + path + '"\n';
  buffer += '  data.queryRequest = req.query\n';
  buffer += '  return data\n';
  buffer += '}\n\n';
  return buffer;
}

function setGetters(instructions, buffer) {
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Functions to Send Response for Paths\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  for (i = 0; i < Object.keys(instructions).length; ++i) {
    key = 'get' + i;
    path = instructions[key];
    if (path.includes("STREAM")) {
      relpath = path.split(' ')[1]
      if(relpath === '/'){
        relpath = "rootFunc";
      }
      buffer = addPathGetResponse(buffer, path.split(' ')[1], relpath);
    } else {
      relpath = path;
      if(relpath === '/'){
        relpath = "rootFunc";
      }
      buffer = addPathGetResponse(buffer, path, relpath);
    }
  }
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Path Listeners for Server\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  for (i = 0; i < Object.keys(instructions).length; i++) {
    key = 'get' + i;
    path = instructions[key];
    if (path.includes("STREAM")) {
      relpath = path.split(' ')[1]
      if(relpath === '/'){
        relpath = "rootFunc";
      }
      buffer = addGetStreamer(buffer, path.split(' ')[1], relpath);
    } else {
      relpath = path;
      if(relpath === '/'){
        relpath = "rootFunc";
      }
      buffer = addGet(buffer, path, relpath);
    }
  }
  return buffer;
}


function setPosters(instructions, buffer) {return;}
function setPutters(instructions, buffer) {return;}
function setDeleters(instructions, buffer) {return;}


function setFooter(buffer, port) {
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += '//Makes Server Listen for Clients\n';
  buffer += '///////////////////////////////////////////////////////////////////\n';
  buffer += 'app.listen(port, () =>\n';
  buffer += '  console.log(`Server listening on port 127.0.0.1:${port}/!`));\n';
  return buffer;
}

function createServerFile(instructions, port){
  buffer = setHeader(port);
  if (instructions["get"] != null) {
    if (Object.keys(instructions["get"]).length) {
      buffer = setGetters(instructions["get"], buffer);
    }
  }
  if (instructions["post"] != null) {
    if (Object.keys(instructions["post"]).length) {
      buffer = setPosters(instructions["post"], buffer);
    }
  }
  if (instructions["put"] != null) {
    if (Object.keys(instructions["put"]).length) {
      buffer = setPutters(instructions["get"], buffer);
    }
  }
  if (instructions["delete"] != null) {
    if (Object.keys(instructions["delete"]).length) {
      buffer = setDeleters(instructions["get"], buffer);
    }
  }
  buffer = setFooter(buffer, port);
  return buffer;
}

fs.readFile('serverInfo.json', (err, data) => {
    if (err) throw err;
    let instructions = JSON.parse(data);
    port = instructions["port"];
    filename = instructions["path"];
    buffer += createServerFile(instructions, port);
    fs.writeFile(filename, buffer, function(err) {

        if(err) {
            return console.log(err);
        }

        console.log(`Node Server Created in ${filename}!`);
    });
});
