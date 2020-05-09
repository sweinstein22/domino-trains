const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;
const helmet = require('helmet');
const storage = require('node-persist');

const app = express();
const server = require('http').Server(app);

storage.init({expiredInterval: 0,} );

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors({ origin: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//pre-flight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

const simpleEndpoint = async (endpoint, req, res) => {
  try {
    if (req.method === 'GET') {
      let value = await storage.getItem(endpoint) || [];
      res.status(200).json(value);
    } else if (req.method === 'POST') {
      await storage.setItem(endpoint, req.body);
      res.status(200).json(req.body);
    } else if (req.method === 'PUT') {
      res.json({hello: 'world'});
    }
  } catch (e) {
    console.log(endpoint, ': ', e)
  }
};

const mergeEndpoint = async (endpoint, req, res) => {
  try {
    if (req.method === 'GET') {
      const players = await storage.getItem('players');
      let value = {};
      await Promise.all(
        players.value.map((_, index) => storage.getItem(`${endpoint}${index}`) || [])
      ).then(
        (fetchedValues) => fetchedValues.map((val, index) => value[index] = val)
      );
      res.status(200).json(value);
    } else if (req.method === 'POST') {
      if (!(req.body && req.body.value)) return;
      Object.keys(req.body.value).map(async index => await storage.setItem(`${endpoint}${index}`, req.body.value[index]));
      res.json(req.body)
    } else if (res.method === 'PUT') {
      res.json({hello: 'world'});
    }
  } catch (e) {
    console.log(endpoint, ': ', e)
  }
};

app.all('/playerState', async (req, res) => {
  mergeEndpoint('playerState', req, res);
});

app.all('/currentTurnPlayer', async (req, res) => {
  simpleEndpoint('currentTurnPlayer', req, res);
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

app.all('/reset', async (req, res) => {
  try {
    storage.setItem('playerCount', {value: null});
    storage.setItem('round', {value: 12});
    res.sendStatus(200);
  } catch (e) {
    console.log('clear failed: ', e);
  }
});

app.all('/round', async (req, res) => {
  simpleEndpoint('round', req, res);
});

app.all('/trains', async (req, res) => {
  simpleEndpoint('trains', req, res);
});


server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ' + port);
  console.log('Node Endpoints working :)');
});

module.exports = server;

