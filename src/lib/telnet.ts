import { ConnectOptions } from 'telnet-client';
const telnet_client = require('telnet-client');

import config from '../config';
import EventEmitter = require('events');
import { error, log } from '../core/log';

export default class Telnet extends EventEmitter {
  public get connected(): boolean {
    return this._connected;
  }
  private client = new telnet_client();
  private params = <ConnectOptions>{};
  private _connected = false;
  private firstPackage = -1;
  private endTelnetConnectionManually = false;
  public dataEvent;
  public static lastData = -1;
  constructor() {
    super();
    this.params.negotiationMandatory = false;
    this.params.timeout = 2500;
    this.params.port = parseInt(config.get('vantage.port'));
    this.params.host = config.get('vantage.url');
    this.client.on('timeout', () => this.onTimeout(this));
    this.client.on('data', (d: any) => this.onData(this, d));
    this.client.on('close', () => this.onClose(this));
    this.client.on('error', (e: any) => this.onError(this, e));
    this.client.on('connect', () => this.onConnect(this));
    this.connect();
    this.dataEvent = new EventEmitter();
  }

  onData(self: this, data: any) {
    self.firstPackage++;
    if (self.firstPackage > 1 && self._connected) {
      Telnet.lastData = Date.now();
      self.dataEvent.emit('data', data);
    }
  }

  onTimeout(self: this) {
    self._connected = false;
    log('<TELNET> ConnectionTimeout');
    self.connect();
  }

  onClose(self: this) {
    log('<TELNET> Got close event');
    if (self.endTelnetConnectionManually) {
      self._connected = false;
    } else {
      //self.connect();
      log('<TELNET> This should never be called?');
    }
  }

  onError(self: this, err: any) {
    error(err);
    self.firstPackage = -1;
    self._connected = false;
    log('<TELNET>  ERROR');
    if (err.code === 'ENOBUFS') process.exit(1);
    self.connect();
  }

  onConnect(self: this) {
    self.firstPackage = -1;
    log('<TELNET> Connection created / connected');
  }

  connect() {
    this.client
      .connect(this.params)
      .then(() => this.connectCallback(this))
      .catch(this.onTimeout);
  }
  connectCallback(_self: this) {
    log('<TELNET> Starting Connection...');
    this._connected = true;
    this.firstPackage = -1;
    this.client
      .send('LOOP -1')
      .then((_: any) => {
        log('<TELNET> Sent LOOP Command');
      })
      .catch((_: any) => {
        log('<TELNET> Error while sending LOOP package');
        this.firstPackage = -2;
      });
  }
  end(): Promise<true> {
    return new Promise((resolve) => {
      this.endTelnetConnectionManually = true;
      log('<TELNET> Attempting to close connection...');
      if (this.client && this.client.end)
        this.client.end().then((_: any) => {
          log('<TELNET> Connection closed');
          resolve(true);
        });
    });
  }
}
