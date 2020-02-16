const express = require('express');
const app = express();
const port = 3000;

app.get("/", function (req, res) {
  res.set({
    'Content-Type' : 'text/plain',
  })
  data = Math.random()*1000000;
  res.send(data);
})

app.listen(port, () =>
  console.log(`Server listening on port 127.0.0.1:${port}/!`));
