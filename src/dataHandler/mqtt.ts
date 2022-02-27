import { DataReceiver } from '../lib/dataReceiver';
import { DataPackage } from '../interfaces/IPackage';

class Mqtt extends DataReceiver<DataPackage> {
  public onData(data: DataPackage): void {
    console.log(data);
  }
}

export default Mqtt;
