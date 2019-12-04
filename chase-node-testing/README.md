# Running Server
## Windows
Head to https://nodejs.org/en/download/ and download and Install the Latest Long-Term Support (LTS) Node Js.  
With Downloading Node, you should have also downloaded a support package with CLI called NPM.
Next, clone into the git repository via https://github.com/masonschmidt/PCI-Efficiency-Project.git  
The repository should have the Dependencies installed already, however, if there are issue, ensure  
Express, Connect-Timeout, and Seed Random are installed and saved using:
```
npm install express --save
npm install connect-timeout --save
npm install seedrandom --save
```
Now all dependencies should be correct and you should be able to run the server.
Run the command  
```
node generator_model.js
```
and it should create endpoints at http://127.0.0.1:3001  

## Linux
Open the Terminal and use the commands  
```
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install nodejs -y
sudo apt-get install npm -y
```
to download Node JS.
With Downloading Node, you should have also downloaded a support package with CLI called NPM.
Next, clone into the git repository via https://github.com/masonschmidt/PCI-Efficiency-Project.git  
The repository should have the Dependencies installed already, however, if there are issue, ensure  
Express, Connect-Timeout, and Seed Random are installed and saved using:
```
npm install express --save
npm install connect-timeout --save
npm install seedrandom --save
```
Now all dependencies should be correct and you should be able to run the server.
Run the command  
```
node generator_model.js
```
and it should create endpoints at http://127.0.0.1/3001  

# Generator_Model.js
## Node Server Dependencies  
| Dependency      | Description                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------|
| Express         | Widely Used Webserver Framework, Easy to Read Program Code, Allows for Easy Callbacks, Easily Deals with Paths     |
| Connect-Timeout | Allows for Request to Timeout and Server Handles The Connection Pop                                                |
| Seed Random     | Math.Random does not have a set Random Seed, so to alleviate this issue, Seed Random is imported into the program. |
| Events          | Allows for Emitters on each random number in the rng array. Listeners can be connected to the Emitters.            |

## Program Constraints
| Server Constraints | Description                                                                                    |
|--------------------|------------------------------------------------------------------------------------------------|
| Input Time         | Time until the new Fuel Consumed Value is produced.                                            |
| Output Time        | Time until the new Power Produced Value is Produced.                                           |
| Server Size        | Size of the Server in terms of array memory                                                    |
| Status Time        | Time before the server program shows its connection status                                     |
| RNG Array          | An array of random numbers that allows for synchronous results.                                |
| Input Emitters     | An array of Input Emitters that are in parallel with the rng array.                            |
| Output Emitters    | An array of Output Emitters that are in parallel with the rng array.                           |
| Connections        | An array of low memory values that show true or false for a connection to show server details. |

## Server Dependencies and Memory  
### Scaling Server Memory Globally
The RNG array is connected to the emitters in such a way that we can imagine the input emitters are connected to the first N RNG elements and the output emitters are connected to the last N rng elements. The connection array shall span the whole of the RNG array.

## Server Status Log  
A Log to the console which can be wrote and appended to a log file at a certain amount of time

## Helper Functions  
### Set Outbound Emitter
#### Parameter: Generator Number
Once a Random Number is Produced for the Generator Output, The Emitter is Invoked that allows the correct function listening to pull the new output every 5 seconds.

### Set Inbound Emitter
#### Parameter: Generator Number
Once a Random Number is Produced for the Generator Input, The Emitter is Invoked that allows the correct function listening to pull the new input every 10 seconds.

### Close Connection
#### Parameter: Request, Response, Generator Number
Closes the Generator Connection and clears the corresponding interval that outputs JSON. After timeout, the server closes the response and the Garbage Collector takes care of the rest allowing the server to recoup resources.

### Set Head
#### Parameter: Response, Streaming Boolean
Function that sets the head of the response to keep the connection alive and allows for streaming to the endpoint or also sends a static response and closes the connection.

### Send Response
#### Parameter: Response, Data, Streaming Boolean
Function that sends the response to the the corresponding endpoint whether this be a stream or a single response.

## Data Setters  
| Route                     | Description                                                                                                                       |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Set Server Information    | Sets the server information in a JSON object called Data. |
| Set Generator Information | Sets the Generator information in a JSON object called Data. |
| Set Fuel Information      | Sets the Fuel information in a JSON object called Data. |
| Set Power Information     | Sets the Power information in a JSON object called Data. |

## Server Routes  
| Route                                 | Description                                                                                                                       |
|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| /                                     | Testing Route that returns the url and the query as JSON.                                                                         |
| /generator                            | Testing Route that returns the url and the query as JSON.                                                                         |
| /generator/:generatorID               | Route that returns the input every n seconds and the output every n seconds. Generator ID is a path parameter that is an integer. |
| /generator/:generatorID/fuelConsumed  | Route that returns the input every n seconds only. Generator ID is a path parameter that is an integer.                           |
| /generator/:generatorID/powerProduced | Route that returns the output every n seconds only. Generator ID is a path parameter that is an integer.                          |

## Start Server  
Function that allows the Server to Listen on a certain port. The current IP address is on Local Host.
