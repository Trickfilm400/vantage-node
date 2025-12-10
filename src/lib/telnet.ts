import { ConnectOptions } from 'telnet-client';
import { Telnet as TelnetClient } from 'telnet-client';
import config from '../config';
import EventEmitter = require('events');
import { logger } from '../core/logger';
import { clearTimeout } from 'node:timers';

export default class Telnet extends EventEmitter {
  public get connected(): boolean {
    return this._connected;
  }
  private client = new TelnetClient();
  private params = <ConnectOptions>{};
  private _connected = false;
  private firstPackage = -1;
  private endTelnetConnectionManually = false;
  private pendingConnectionTimeout: NodeJS.Timeout;
  public static lastData = -1;
  constructor() {
    super();
    this.params.negotiationMandatory = false;
    this.params.timeout = 12500;
    this.params.port = parseInt(config.get('vantage.port'));
    this.params.host = config.get('vantage.url');
    this.client.on('timeout', () => this.onTimeout(this));
    this.client.on('data', (d: any) => this.onData(this, d));
    this.client.on('close', () => this.onClose(this));
    this.client.on('error', (e: any) => this.onError(this, e));
    this.client.on('connect', () => this.onConnect(this));
    this.connect();
  }

  reStartConnection() {
    if (!this.pendingConnectionTimeout) {
      logger.debug('(TELNET - pendingConnectionTimeout) - setting timeout now');
      this.pendingConnectionTimeout = setTimeout(() => this.connect(), 10_000);
    } else {
      logger.debug(
        '(TELNET - pendingConnectionTimeout) - timeout was already set. skipping.'
      );
    }
  }

  onData(self: this, data: any) {
    self.firstPackage++;
    if (self.firstPackage > 1 && self._connected) {
      Telnet.lastData = Date.now();
      self.emit('data', data);
    }
  }

  onTimeout(self: this) {
    self._connected = false;
    logger.warn('(TELNET - onTimeout) ConnectionTimeout');
    self.reStartConnection();
  }

  onClose(self: this) {
    logger.info('(TELNET - onClose) Got close event');
    if (self.endTelnetConnectionManually) {
      self._connected = false;
    } else {
      self.reStartConnection();
      logger.error(
        '(TELNET - onClose) This should never be called? (reconnect on close event)'
      );
    }
  }

  onError(self: this, err: any) {
    self.firstPackage = -1;
    self._connected = false;
    logger.error('(TELNET- onError) ERROR: ' + err);
    if (err.code === 'ENOBUFS') process.exit(1);
    self.reStartConnection();
  }

  onConnect(self: this) {
    self.firstPackage = -1;
    logger.info('(TELNET - onConnect) Connection created / connected');
  }

  connect() {
    clearTimeout(this.pendingConnectionTimeout);
    this.client
      .connect(this.params)
      .then(() => this.connectCallback())
      .catch((e) => {
        //this.onTimeout(this)
        logger.error('(TELNET - connect.catch) Cannot Connect to telnet: ' + e);
      });
  }
  connectCallback() {
    logger.info('(TELNET - connectCallback) Starting Connection...');
    this._connected = true;
    this.firstPackage = -1;
    this.client
      .send('LOOP -1')
      .then((_: any) => {
        logger.info('(TELNET - connectCallback) Sent LOOP Command');
      })
      .catch((_: any) => {
        logger.warn(
          '(TELNET - connectCallback) Error while sending LOOP package'
        );
        this.firstPackage = -2;
      });
  }
  end(): Promise<true> {
    return new Promise((resolve) => {
      this.endTelnetConnectionManually = true;
      logger.info('(TELNET - end) Attempting to close connection...');
      if (this.client && this.client.end)
        this.client.end().then((_: any) => {
          logger.info('(TELNET - end) Connection closed');
          resolve(true);
        });
    });
  }
}
