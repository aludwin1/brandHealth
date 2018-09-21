const request = require('request');
const app = require('express')();
const port = process.env.PORT || 3000;
const api_key = process.env.api_key;
const app_id = process.env.app_id;

app.get('/', function(req, res) {
  res.send(JSON.stringify({ Hello: 'World' }));
});

app.listen(port);
