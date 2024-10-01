import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import Telnet from './telnet';
import DataHandler from './dataHandler';
import { prometheusRegister } from '../dataHandler/prometheus';
import config from '../config';

export class HttpServer {
  public static httpServer: http.Server;
  constructor() {
    HttpServer.httpServer = http.createServer((req, res) =>
      this.requestHandler(req, res)
    );
    HttpServer.httpServer.listen(parseInt(config.get('socket.port')));
  }

  private async requestHandler(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json');

    switch (req.url) {
      case '/test':
        res.writeHead(200);
        res.end(`{"message": "Test successful", "code": 200}`);
        break;
      case '/healthcheck': {
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
      }
      case '/lastdata': {
        res.writeHead(200);
        const json = DataHandler.getLastDataset();
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
      case '/metrics': {
        res.setHeader('Content-Type', prometheusRegister.contentType);
        res.end(await prometheusRegister.metrics());
        break;
      }
      default:
        res.writeHead(204);
        res.end(JSON.stringify({ code: 204, message: 'OK', value: null }));
        break;
    }
  }
  cleanup() {
    HttpServer.httpServer.close();
  }
}
