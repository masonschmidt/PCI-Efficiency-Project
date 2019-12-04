var EventSource = require("eventsource");
/*
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'cglenn',
  host: 'localhost',
  database: 'postgres',
  password: 'cglenn',
  port: 5432,
})
*/

var generators = 3000;
var efficiencyTime = 30000;
var inputOutputRatio = 2;

var input_sums = new Array(generators).fill(0.0);
var output_sums = new Array(generators).fill(0.0);
var times = new Array(generators).fill(0);

var sources = []
for(i = 0; i < generators; ++i){
  sources.push(new EventSource('http://127.0.0.1:3001/generator/' + i + '/'));
  sources[i].onmessage = function(e) {

    // Get JSON from EndPoint
    let values = JSON.parse(e.data);
    let j = values["generator"];

    // If Data is Power Produced
    if(values.hasOwnProperty('powerProduced')){
      output_sums[j] += values["powerProduced"];
      //pool.query('INSERT INTO powerProduced (generator, time, output) VALUES ($1, $2, $3)', [values["generator"], values["time"], values["powerProduced"]], (error, results) => {
        //if (error) {console.log('Database Error has Occurred'); throw error;}})
        console.log('output: ' + values['powerProduced'])
    }
    // If Data is Fuel Consumed
    if(values.hasOwnProperty('fuelConsumed')){
      //pool.query('INSERT INTO fuelConsumed (generator, time, input) VALUES ($1, $2, $3)', [values["generator"], values["time"], values["fuelConsumed"]], (error, results) => {
        //if (error) {console.log('Database Error has Occurred'); throw error;}})
      console.log('output: ' + values['fuelConsumed'])
      input_sums[j] += values["fuelConsumed"];
    }

    // Set Start time of Each Generator
    if(times[j] == 0) times[j] = values["time"];
    else {

      // Every 30 Seconds, Display Efficiency Data as JSON
      if ((values["time"] - times[j]) >= efficiencyTime){
        let data = {}
        data.generator = j;
        data.startTime = times[j];
        data.endTime = values["time"];
        data.output = output_sums[j]/inputOutputRatio;
        data.input = input_sums[j];
        data.efficiency = (data.input*3.412)/(data.output);
        sendData(data);
        // RESET ACCUMULATION and TIME
        output_sums[j] = 0.0;
        input_sums[j] = 0.0;
        times[j] = 0;
      }
    }
  };
  sources[i].setMaxListeners(1);
}

function sendData(data){
  //pool.query('INSERT INTO generatorefficiency (generator, starttime, endtime, accumulatedinput, accumulatedoutput, efficiency) VALUES ($1, $2, $3, $4, $5, $6)', [data.generator, data.startTime, data.endTime, data.input, data.output, data.efficiency], (error, results) => {
    //if (error) {console.log('Database Error has Occurred'); throw error;}})

}
