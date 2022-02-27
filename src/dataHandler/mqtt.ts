import { DataReceiver } from '../lib/dataReceiver';
import { DataPackage } from '../interfaces/IPackage';
import { logger } from '../core/logger';
import config from '../config';
import { MqttClient, connect } from 'mqtt';

class Mqtt extends DataReceiver<DataPackage> {
  private client: MqttClient;
  private readonly topic: string;
  private readonly options = { retain: true };
  private readonly enabled: boolean;

  constructor() {
    super(config.get('mqtt.enable') ? 'default' : null);
    this.topic = config.get('mqtt.topic');
    this.enabled = config.get('mqtt.enable');
    if (this.enabled) {
      logger.info('[ DataHandlers ] -> Enabled MQTT');
      this.connect();
    }
  }

  connect() {
    logger.info('Connecting to MQTT');
    this.client = connect(`mqtt://${config.get('mqtt.host')}`, {
      clientId: config.get('mqtt.clientid'),
      clean: true,
      connectTimeout: 4000,
      username: config.get('mqtt.user'),
      password: config.get('mqtt.password'),
    });
    this.client.on('connect', () => logger.info('Connected to MQTT broker'));
  }
  public onData(data: DataPackage): void {
    let key: keyof DataPackage;
    for (key in data) {
      //console.log(data[key], key);
      this.client.publish(this.topic + key, data[key].toString(), this.options);
    }
  }
}

export default Mqtt;
