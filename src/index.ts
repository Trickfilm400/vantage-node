console.log('Starting Program...');

import { HttpServer } from './lib/httpServer';
const httpServer = new HttpServer();

import DataHandler from './lib/dataHandler';

const dataHandler = new DataHandler();

//load dataHandlers
import Database from './dataHandler/database';
const db = new Database();
import SocketIO from './dataHandler/socket';
const socket = new SocketIO();
import Mqtt from './dataHandler/mqtt';
const mqtt = new Mqtt();
import { Prometheus } from './dataHandler/prometheus';
const prometheus = new Prometheus();
import { Influxdb } from './dataHandler/influxdb';
const influxdb = new Influxdb();

process.on('SIGINT', () => {
  console.log('\n');
  db.cleanup()
    .then(() => dataHandler.close())
    .then(() => socket.cleanup())
    .then(() => mqtt.cleanup())
    .then(() => prometheus.cleanup())
    .then(() => influxdb.cleanup())
    .then(() => httpServer.cleanup())
    .then(() => {
      process.exit(0);
    });
});
