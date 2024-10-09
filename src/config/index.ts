import * as convict from 'convict';
import * as path from 'path';
import * as fs from 'fs';

// Define Config schema
const config = convict({
  loglevel: {
    doc: 'The application loglevel.',
    format: String,
    default: 'info',
    env: 'LOGLEVEL',
  },
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
  influxdb: {
    enabled: {
      doc: 'if influxdb should be used',
      format: Boolean,
      default: false,
      env: 'INFLUXDB_ENABLED',
    },
    skip_same_values: {
      doc: 'if the value has not changed since the last value, dont write it into the db',
      format: Boolean,
      default: true,
      env: 'INFLUXDB_SKIP_SAME_VALUES',
    },
    url: {
      doc: 'The URL Endpoint for InfluxDB',
      format: String,
      default: '',
      env: 'INFLUXDB_URL',
    },
    api_token: {
      doc: 'The API Token for InfluxDB',
      format: String,
      default: '',
      env: 'INFLUXDB_API_TOKEN',
    },
    organisation: {
      doc: 'The organisation for InfluxDB',
      format: String,
      default: '',
      env: 'INFLUXDB_ORGANISATION',
    },
    bucket: {
      doc: 'The bucket for InfluxDB',
      format: String,
      default: '',
      env: 'INFLUXDB_BUCKET',
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
      env: 'MYSQL_IP',
    },
    port: {
      doc: 'The Port Mysql should connect to',
      format: 'port',
      default: '3306',
      env: 'MYSQL_PORT',
    },
    database: {
      doc: 'The Database Mysql should use',
      format: String,
      default: 'weather',
      env: 'MYSQL_DB',
    },
    username: {
      doc: 'The Username Mysql should use',
      format: String,
      default: 'weather',
      env: 'MYSQL_USERNAME',
    },
    password: {
      doc: 'The Password Mysql should use',
      format: String,
      default: '',
      env: 'MYSQL_PASSWORD',
    },
  },
  mqtt: {
    enable: {
      doc: 'EMQX enable',
      format: Boolean,
      default: true,
      env: 'EMQX_ENABLE',
    },
    host: {
      doc: 'The IP address for connecting to mqtt',
      format: String,
      default: 'emqx',
      env: 'EMQX_HOST',
    },
    user: {
      doc: 'EMQX username',
      format: String,
      default: 'emqx',
      env: 'EMQX_USER',
    },
    password: {
      doc: 'EMQX password',
      format: String,
      default: '',
      env: 'EMQX_PASSWD',
    },
    clientid: {
      doc: 'The Port for connecting to mqtt',
      format: String,
      default: 'mqtt_vantage_node_system_client',
      env: 'EMQX_CLIENTID',
    },
    topic: {
      doc: 'The topic for mqtt',
      format: String,
      default: 'vantage_data',
      env: 'EMQX_TOPIC',
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
