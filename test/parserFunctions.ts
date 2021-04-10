import packageParser, {
  IPackageParserReturnValue,
} from '../src/lib/packageParser';
import assert = require('assert');
import * as fs from 'fs';
import * as path from 'path';

describe('#packageParser()', () => {
  const errorExpected: IPackageParserReturnValue = {
    error: true,
    data: null,
  };
  it('should throw an error if input is not a buffer', () => {
    assert.deepStrictEqual(packageParser('string'), errorExpected);
  });
  it('should throw an error on empty input', () => {
    assert.deepStrictEqual(packageParser(undefined), errorExpected);
  });
  it('should return an error if incorrect buffer is given', () => {
    assert.deepStrictEqual(
      packageParser(Buffer.from('nothing')),
      errorExpected
    );
  });
  it('should parse the example package correctly', () => {
    const examplePackage = fs.readFileSync(
      path.join(__dirname, 'examplePackage.txt')
    );
    assert.deepStrictEqual(packageParser(examplePackage), <
      IPackageParserReturnValue
    >{
      data: {
        barometer: 998.0506550751334,
        inTemperature: 21.166666666666664,
        inHumidity: 21,
        outHumidity: 51,
        outTemperature: 6.888888888888888,
        windSpeed: 0,
        windDirection: 285,
        dayRain: 0,
        rainRate: 0,
      },
      error: false,
    });
  });
});
