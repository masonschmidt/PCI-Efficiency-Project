const http = require("http");
i = 0;
http.createServer((request, response) => {
  console.log("Requested url: " + request.url);

  if (request.url.toLowerCase() === "/events") {
    postEvents(request, response);
  } else {
    response.writeHead(404);
    response.end();
  }
}).listen(5000, () => {
  console.log("Server running at http://127.0.0.1:5000/");
});

function postEvents(request, response){
  response.writeHead(200, {
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache"
  });

  request.connection.on('close',function(){
    console.log("Connection Broken");
    response.end();
    clearInterval(hasConnection);
  });

  var hasConnection = setInterval(() => {
    if(i == 0){
      response.write("event: message\n");
      response.write('data: {"title": "GoodBye There"}\n\n');
      i = 1;
    } else {
      response.write("event: message\n");
      response.write('data: {"title": "Hello There"}\n\n');
      i = 0;
    }
    console.log("Events sent");
  }, 3000);
}
