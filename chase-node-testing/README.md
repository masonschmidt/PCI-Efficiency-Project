# Node Server Dependencies  
## Express  
Widely Used Webserver Framework  
Easy to Read Program Code  
Allows for Easy Callbacks  
Easily Deals with Paths  
## Connect-Timeout  
Allows for Request to Timeout and Server Handles The Connection Pop
## Seed Random
Math.Random does not have a set Random Seed, so to alleviate this issue, Seed Random is imported into the program.
## Events  
Allows for Emitters on each random number in the rng array. Listeners can be connected to the Emitters.
# Program Constraints
## Input Time  
Time until the new Fuel Consumed Value is produced.
## Output Time  
Time until the new Power Produced Value is Produced.
## Server Size
Size of the Server in terms of array memory
## Status Time
Time before the server program shows its connection status
## RNG Array
An array of random numbers that allows for synchronous results.
## Input Emitters
An array of Emitters that are in parallel with the rng array.
## Output Emitters
An array of Emitters that are in parallel with the rng array.
## Connections
An array of low memory values that show true or false for a connection to show server details.
# Server Dependencies and Memory  
## Scaling Server Memory Globally
The RNG array is connected to the emitters in such a way that we can imagine the input emitters are connected to the first N RNG elements and the output emitters are connected to the last N rng elements. The connection array shall span the whole of the RNG array.
# Server Status Log  
A Log to the console which can be wrote and appended to a log file at a certain amount of time
# Helper Functions  
## Set Outbound Emitter
### Parameter: Generator Number

## Set Inbound Emitter
### Parameter: Generator Number

## Close Connection
### Parameter: Request, Response, Generator Number

## Set Head
### Parameter: Response, Streaming Boolean

## Send Response
### Parameter: Response, Data, Streaming Boolean

# Data Setters  
## Set Server Information
## Set Generator Information
## Set Fuel Information
## Set Power Information
# Server Routes  
## Route /
## Route /generator
## Route /generator/:generatorID
## Route /generator/:generatorID/fuelConsumed
## Route /generator/:generatorID/powerProduced
# Start Server  
