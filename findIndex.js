function findLastIndex(array, predicate, fromIndex) {
  debugger
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index =
      fromIndex < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
  }
  return baseFindIndex(array, predicate, index, true);
}

function findIndex(array, predicate, fromIndex) {
  debugger
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index =  length - 1;
  (fromIndex == undefined) && (index = 0);
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index =
      fromIndex < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
  }
  return baseFindIndex(array, predicate, index);
}

function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const { length } = array;
  let index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

function toInteger(value) {
  const result = toFinite(value);
  const remainder = result % 1;

  return remainder ? result - remainder : result;
}

const INFINITY = 1 / 0
const MAX_INTEGER = 1.7976931348623157e+308

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

/** Used as references for various `Number` constants. */
const NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt;

function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

function isSymbol(value) {
  const type = typeof value;
  return (
    type == 'symbol' ||
    (type === 'object' && value != null && getTag(value) == '[object Symbol]')
  );
}

const toString = Object.prototype.toString;

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
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

function head(array) {
  return array != null && array.length ? array[0] : undefined;
}

function indexOf(array, value, fromIndex) {
  debugger
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = Math.max(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const { length } = array;
  let index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

function baseIsNaN(value) {
  return value !== value;
}

function strictIndexOf(array, value, fromIndex) {
  let index = fromIndex - 1;
  const { length } = array;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}


const users = [
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true },
  { 'user': 'barney',  'active': false },
];
// console.log(findIndex(users, (o) => { return o.user == 'barney'; }, 1))

// console.log(indexOf(users, [{ 'user': 'fred', 'active': false }]))
findLastIndex(users, (o) => { return o.user == 'pebbles'; }, 2)