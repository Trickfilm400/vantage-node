import { DataPackage } from '../interfaces/IPackage';
import config from '../config';
import { Server, Socket } from 'socket.io';
import { DataReceiver } from '../lib/dataReceiver';
import { logger } from '../core/logger';
import { HttpServer } from '../lib/httpServer';

export default class SocketIO extends DataReceiver<DataPackage> {
  private io: Server;
  private readonly enabled: boolean = false;

  public constructor() {
    super(config.get('socket.enabled') ? 'default' : null);
    this.enabled = config.get('socket.enabled');
    if (this.enabled) {
      this.io = new Server(HttpServer.httpServer, {
        cors: {
          origin: '*',
        },
      });
      this.io.on('connection', this.onConnectionListener);
      logger.info(
        '[ DataHandlers ] -> Enabled Socket.io; Port: ' +
          config.get('socket.port')
      );
    }
  }

  private onConnectionListener(socket: Socket) {
    logger.debug(
      '<SOCKET> New Socket Connection from ' + socket.handshake.address
    );
  }

  onData(data: DataPackage): void {
    this.io.sockets.emit('data', {
      barometer: data.barometer,
      intemp: data.inTemperature,
      inhum: data.inHumidity,
      outtemp: data.outTemperature,
      outhum: data.outHumidity,
      windspeed: data.windSpeed,
      winddir: data.windDirection,
      rainrate: data.rainRate,
      dayrain: data.dayRain,
    });
  }
}
