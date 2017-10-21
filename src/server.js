const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { router: blockchainRouter } = require('./blockchain');

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.use('/', blockchainRouter);

module.exports = server;
