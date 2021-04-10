import * as socket from 'socket.io';
import { IPackage } from '../interfaces/IPackage';
import config from '../config';
import { Server, Socket } from 'socket.io';
import { log } from '../core/log';

export default class SocketIO {
  private io: Server;
  private readonly enabled: boolean = false;
  public constructor() {
    this.enabled = config.get('socket.enabled');
    if (this.enabled) {
      this.io = socket();
      this.io.on('connection', this.onConnectionListener);
      this.io.listen(parseInt(config.get('socket.port')));
      log('<SOCKET> Enabled Socket.IO on port ' + config.get('socket.port'));
    }
  }
  private onConnectionListener(socket: Socket) {
    log('<SOCKET> New Socket Connection from ' + socket.handshake.address);
  }
  public sendData(data: IPackage) {
    if (this.enabled)
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
