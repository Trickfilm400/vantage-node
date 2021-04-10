import * as convict from 'convict';
import * as path from 'path';
import * as fs from 'fs';

// Define Config schema
const config = convict({
  vantage: {
    url: {
      doc: 'The URL for the vantage Pro Device',
      format: String,
      default: '',
      env: 'VANTAGE_URL',
    },
    port: {
      doc: 'The Port for the Vantage Pro Device',
      format: String,
      default: '22222',
      env: 'VANTAGE_PORT',
    },
  },
  mysql: {
    enabled: {
      doc: 'The IP address Mysql should connect to',
      format: Boolean,
      default: true,
      env: 'MYSQL_ENABLED',
    },
    ip: {
      doc: 'The IP address Mysql should connect to',
      format: String,
      default: '127.0.0.1',
      env: 'DB_IP',
    },
    port: {
      doc: 'The Port Mysql should connect to',
      format: 'port',
      default: '3306',
      env: 'DB_PORT',
    },
    database: {
      doc: 'The Database Mysql should use',
      format: String,
      default: '',
      env: 'DB_DB',
    },
    username: {
      doc: 'The Username Mysql should use',
      format: String,
      default: '',
      env: 'DB_USERNAME',
    },
    password: {
      doc: 'The Password Mysql should use',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
    },
  },
  socket: {
    port: {
      doc: 'The Websocket Port to use',
      format: Number,
      default: '3010',
      env: 'SOCKET_PORT',
    },
    enabled: {
      doc: 'Should Websocket be enabled?',
      format: Boolean,
      default: true,
      env: 'SOCKET_ENABLED',
    },
  },
  saveinterval: {
    doc: 'The Interval to save in Database, in seconds',
    format: Number,
    default: 60,
    env: 'SAVE_INTERVAL',
  },
  config: {
    doc: 'Location of Config File',
    format: String,
    default: path.join(__dirname, '..', '..', 'config.json'),
    env: 'CONFIG_FILE',
  },
});

//Load Config json File based on default or Environment Variable
if (fs.existsSync(config.get('config'))) {
  config.loadFile(config.get('config'));
}

//Validate Config Parameter

config.validate({ strict: true });
export default config;
