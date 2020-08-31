function drop(array, n = 1) {
  const length = array == null ? 0 : array.length;
  return length ? slice(array, n < 0 ? 0 : toInteger(n), length) : [];
}

function slice(array, start, end) {
  let length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : (end - start) >>> 0;
  start >>>= 0;

  let index = -1;
  const result = new Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

function toInteger(value) {
  const result = toFinite(value);
  const remainder = result % 1;

  return remainder ? result - remainder : result;
}

const INFINITY = 1 / 0;
const MAX_INTEGER = 1.7976931348623157e308;

function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    const sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value;
    value = isObject(other) ? `${other}` : other;
  }
  if (typeof value !== 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  const isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value)
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : reIsBadHex.test(value)
    ? NAN
    : +value;
}

function dropRight(array, n = 1) {
  debugger;
  const length = array == null ? 0 : array.length;
  n = length - toInteger(n);
  return length ? slice(array, 0, n < 0 ? 0 : n) : [];
}

function baseWhile(array, predicate, isDrop, fromRight) {
  const { length } = array;
  let index = fromRight ? length : -1;

  while (
    (fromRight ? index-- : ++index < length) &&
    predicate(array[index], index, array)
  ) {}

  return isDrop
    ? slice(array, fromRight ? 0 : index, fromRight ? index + 1 : length)
    : slice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
}

function dropRightWhile(array, predicate) {
  debugger;
  return array != null && array.length
    ? baseWhile(array, predicate, true, true)
    : [];
}

function dropWhile(array, predicate) {
  debugger;
  return array != null && array.length ? baseWhile(array, predicate, true) : [];
}

let arr = [1, 2, 3];
console.log(dropRight(arr, 1));

const users = [
  {
    user: 'barney',
    active: false
  },
  {
    user: 'fred',
    active: true
  },
  {
    user: 'pebbles',
    active: true
  }
];

console.log(dropWhile(users, ({ active }) => active));
