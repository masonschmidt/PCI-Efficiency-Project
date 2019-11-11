//////////////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
//////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();

//////////////////////////////////////////////////////////////////////////////////////////
// SECURITY CONTROL
// SOURCE: https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
//////////////////////////////////////////////////////////////////////////////////////////
// Use Protection securities that allow for easy access control to connect to JSON
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//If url is listed, send connection code
app.options('*', function(req, res) {
	res.send(200);
});

//////////////////////////////////////////////////////////////////////////////////////////
// CREATE SERVER
//////////////////////////////////////////////////////////////////////////////////////////
//Get Path of directory, Port, and Server
const path = require('path');
const port = 3000;
const server = require('http').Server(app);

//Let Server listen to the constant port and throw error if there is an error
server.listen(port, (err) => {
	if (err) throw err;
	console.log('Server Listening');
});

//Export the Server
module.exports = server;

//////////////////////////////////////////////////////////////////////////////////////////
// SIMPLE JSON PAGE THAT IS NOT DYNAMIC. CONTROLS QUERY STRINGS /TESTING
//////////////////////////////////////////////////////////////////////////////////////////
//Declare and initiallize the i variable to show different routes from the query string
var i = 0;

//The hello path shows the true raw endpoint, however, this does not change unless the url is called.
app.get('/testing', async function (req, res) {
	res.status(200);

	// Testing for output changes
  let id = req.query.id;

	// Time Testing
  if(id == "time"){
		let date_ob = new Date();
		var str = date_ob.getHours() + ':' + date_ob.getMinutes() + ':' + date_ob.getSeconds();
		res.json({ value : str });

	// Random Number Testing
  } else if(id == "random"){
    res.json({ value : Math.random() });
		
	// Hello Goodbye Swap Testing
  } else {
		if(i == 0){
			res.json({ value : "Hello" });
			i = 1;
		} else {
			res.json({ value : "GoodBye" });
			i = 0;
		}
	}

	//End res connection
	res.end();
});

//////////////////////////////////////////////////////////////////////////////////////////
// SEND AN INLINE REACT HTML/JAVASCRIPT FILE TO CLIENT
// THAT ALLOWS FOR DYNAMIC ENDPOINT BY MULTIPLE REQUESTS
//////////////////////////////////////////////////////////////////////////////////////////
// Show the HTML page with a little JavaScript to call the endpoint for change
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
		console.log(path.join(__dirname + '/index.html'));
});

//////////////////////////////////////////////////////////////////////////////////////////
// ENDPOINT THAT IS DYNAMIC WITH CURL ON CMD
// FOR QUERIES OF TIME, RANDOM NUMBER, AND HELLO/GOODBYE
//////////////////////////////////////////////////////////////////////////////////////////
app.get('/ender', async function (req, res) {
	let id = req.query.id;

	// Time every 3 seconds
	if(id == "time"){
		setInterval(function(){
			let date_ob = new Date();
			var str = date_ob.getHours() + ':' + date_ob.getMinutes() + ':' + date_ob.getSeconds();
			res.write(str + '\n');
		}, 3000);

	// Random Number every 3 seconds
	} else if(id == "random"){
		setInterval(function(){
			res.write(Math.random() + '\n');
		}, 3000);

	//Hello and goodbye every 3 seconds
	} else {
		setInterval(function(){
			if(i == 0){
				res.write('Hello\n');
				i = 1;
			} else {
				res.write('GoodBye\n');
				i = 0;
			}
		}, 3000);
	}
});

//////////////////////////////////////////////////////////////////////////////////////////
// LATER USE: POSTING AND PUTTING FUNCTIONS
//////////////////////////////////////////////////////////////////////////////////////////
// Show log for server working if data is posted to the server
app.post('/', (err, res) => {
	res.status(200);
	res.send('working');
	res.end();
});

// Show log for server working if data is put to the server
app.put('/', (err, res) => {
	res.status(200);
	res.send('working');
	res.end();
});
