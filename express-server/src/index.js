const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;
const helmet = require('helmet');
const storage = require('node-persist');

const app = express();
const server = require('http').Server(app);

storage.init({expiredInterval: 2 * 60 * 1000,} );

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
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

const simpleEndpoint = async (endpoint, req, res) => {
  if (req.method === 'GET') {
    let value = await storage.getItem(endpoint) || {};
    res.status(200).json(value);
  } else if (req.method === 'POST') {
    const {body} = req;
    console.log(body)
    await storage.setItem(endpoint, body);
    res.status(200).json(body);
  } else if (req.method === 'PUT') {
    res.json({hello: 'world'})
  }

};

const mergeEndpoint = async (endpoint, index, method, req, res) => {
  if (method === 'GET') {
    let value = await storage.getItem(endpoint) || {};
    console.log(value)
    res.status(200).json(value);
  } else if (method === 'POST') {
    const {body} = req;
    console.log(body)
    let value = await storage.getItem(endpoint) || {};
    value[index] = body
    await storage.setItem(endpoint, value);
    console.log(value)
    res.status(200).json(value);
  } else if (method === 'PUT') {
    res.json({hello: 'world'})
  }

};

app.all('/playersHands', async (req, res) => {
  let {body, method} = req;
  mergeEndpoint('playerHands', body.index, method, body.value, res);
});

app.all('/publicTrains', async (req, res) => {
  let {body, method} = req;
  mergeEndpoint('publicTrains', body.index, method, body.value, res);
});

app.all('/trains', async (req, res) => {
  simpleEndpoint('trains', req, res);
});

app.all('/dominosRemaining', async (req, res) => {
  simpleEndpoint('dominosRemaining', req, res);
});

app.all('/playerCount', async (req, res) => {
  simpleEndpoint('playerCount', req, res);
});

app.all('/players', async (req, res) => {
  simpleEndpoint('players', req, res);
});

app.all('/round', async (req, res) => {
  simpleEndpoint('round', req, res);
});


server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ' + port);
  console.log('Node Endpoints working :)');
});

module.exports = server;

