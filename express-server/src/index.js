const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 8080;
const helmet = require('helmet');

let gameState = {};

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//pre-flight requests
app.options('*', cors({ origin: true }), (req, res) => {
  res.sendStatus(200);
});

app.all('/gameState', (req, res) => {
  if (req.method === 'GET') {
    res.json(gameState)
  } else if (req.method === 'POST') {
    gameState = req.body;
    res.json(gameState)
  } else if (req.method === 'PUT') {
    res.send({hello: 'world'})
  }
});

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ' + port);
  console.log('Node Endpoints working :)');
});

module.exports = server;

