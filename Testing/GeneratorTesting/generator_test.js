var http = require('http');

var isGood = true;

setInterval(function() {
  console.log('Testing Correct? ' + isGood);
}, 5000);

for(let i = 1; i < 3000; i++){
  
  http.get('http://127.0.0.1:3001/generator/' + i, (event) => {
    
    // A chunk of data has been recieved.
    event.on('data', (chunk) => {
      let data = JSON.parse(chunk.toString('utf-8'));
      if(data.fuelConsumed !== undefined){
        if(data.fuelConsumed < 0 || data.fuelConsumed > 3.409){
          isGood = false;
        }
      }
      if(data.powerProduced !== undefined){
        if(data.powerProduced < 0 || data.powerProduced > 3.409){
          isGood = false;
        }
      }
    });
  
    // The whole response has been received. Print out the result.
    event.on('end', () => {
      isGood = false;

    });  

  }).on("error", (err) => {
    isGood = false;
  });
}
