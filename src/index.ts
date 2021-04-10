console.log('Starting Program...');

import DataHandler from './lib/dataHandler';

const dataHandler = new DataHandler();

process.on('SIGINT', () => {
  console.log('\n');
  dataHandler.close().then(() => {
    process.exit(0);
  });
});
