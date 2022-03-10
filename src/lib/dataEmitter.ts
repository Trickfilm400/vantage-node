import * as EventEmitter from 'events';
import { IPackage } from '../interfaces/IPackage';

class DataEmitter<T> extends EventEmitter {
  public sendData(data: T, channel = 'default') {
    this.emit(channel, data);
  }
}

export default new DataEmitter<IPackage>();
