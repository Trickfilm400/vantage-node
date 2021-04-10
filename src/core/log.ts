function getDateString() {
  function check2Digits(i: number) {
    return i < 10 ? '0' + i : i;
  }
  const d = new Date();
  let str = '[';
  str += ' ' + check2Digits(d.getDay());
  str += '.' + check2Digits(d.getMonth() + 1);
  str += '.' + check2Digits(d.getFullYear());
  str += ' - ' + check2Digits(d.getHours());
  str += ':' + check2Digits(d.getMinutes());
  str += ':' + check2Digits(d.getSeconds());
  str += ' ] ';
  return str;
}

export function error(msg: any) {
  console.error(getDateString() + msg);
}

export function warn(msg: string) {
  console.warn(getDateString() + msg);
}

export function log(msg: string) {
  console.log(getDateString() + msg);
}
