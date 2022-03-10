console.log('Starting Program...');

import DataHandler from './lib/dataHandler';

const dataHandler = new DataHandler();

//load dataHandlers
import Database from './dataHandler/database';
const db = new Database();
import SocketIO from './dataHandler/socket';
const socket = new SocketIO();
import Mqtt from './dataHandler/mqtt';
const mqtt = new Mqtt();

process.on('SIGINT', () => {
  console.log('\n');
  db.cleanup()
    .then(() => dataHandler.close())
    .then(() => socket.cleanup())
    .then(() => mqtt.cleanup())
    .then(() => {
      process.exit(0);
    });
});
