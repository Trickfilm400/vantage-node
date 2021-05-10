import * as http from 'http';
import { IPackage } from '../interfaces/IPackage';
import config from '../config';
import { Server, Socket } from 'socket.io';
import { log } from '../core/log';
import { IncomingMessage, ServerResponse } from 'http';
import DataHandler from './dataHandler';
import Telnet from './telnet';

export default class SocketIO {
  private io: Server;
  private readonly enabled: boolean = false;
  private httpServer: http.Server;
  private dataHandler: DataHandler;
  public constructor(dataHandler: DataHandler) {
    this.dataHandler = dataHandler;
    this.enabled = config.get('socket.enabled');
    if (this.enabled) {
      this.httpServer = http.createServer((req, res) =>
        this.requestHandler(req, res, this)
      );
      this.io = new Server(this.httpServer, {
        cors: {
          origin: '*'
        },
      });
      this.io.on('connection', this.onConnectionListener);
      this.httpServer.listen(parseInt(config.get('socket.port')));
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
  private requestHandler(
    req: IncomingMessage,
    res: ServerResponse,
    self: this
  ) {
    res.setHeader('Content-Type', 'application/json');

    switch (req.url) {
      case '/test':
        res.writeHead(200);
        res.end(`{"message": "Test successful", "code": 200}`);
        break;
      case '/healthcheck':
        const validPackages = Date.now() - Telnet.lastData < 30 * 1000;
        res.writeHead(validPackages ? 200 : 500);
        res.end(
          JSON.stringify({
            message: validPackages
              ? 'Packages are Valid'
              : 'Packages are outdated and invalid!',
            code: validPackages ? 200 : 500,
            value: Telnet.lastData,
          })
        );
        break;
      case '/lastdata':
        res.writeHead(200);
        const json = self.dataHandler.getLastDataset();
        res.end(
          JSON.stringify({
            value: json,
            message: 'Last Dataset of Weatherstation',
            code: 200,
          })
        );
        //req.method
        break;
    }
  }
}
