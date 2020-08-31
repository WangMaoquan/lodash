function difference(array, ...values) {
  debugger;
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
}

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null;
}

function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length);
}

const MAX_SAFE_INTEGER = 9007199254740991;

function isLength(value) {
  return (
    typeof value === 'number' &&
    value > -1 &&
    value % 1 == 0 &&
    value <= MAX_SAFE_INTEGER
  );
}

function baseFlatten(array, depth, predicate, isStrict, result) {
  predicate || (predicate = isFlattenable);
  result || (result = []);

  if (array == null) {
    return result;
  }

  for (const value of array) {
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        result.push(...value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

function isFlattenable(value) {
  return (
    Array.isArray(value) ||
    isArguments(value) ||
    !!(value && value[spreadableSymbol])
  );
}

function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]';
}

const toString = Object.prototype.toString;
function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
}

const LARGE_ARRAY_SIZE = 200;

function baseDifference(array, values, iteratee, comparator) {
  let includes = arrayIncludes;
  let isCommon = true;
  const result = [];
  const valuesLength = values.length;

  if (!array.length) {
    return result;
  }
  if (iteratee) {
    values = map(values, (value) => iteratee(value));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  } else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer: for (let value of array) {
    const computed = iteratee == null ? value : iteratee(value);

    value = comparator || value !== 0 ? value : 0;
    if (isCommon && computed === computed) {
      let valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    } else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

const HASH_UNDEFINED = '__lodash_hash_undefined__';

class SetCache {
  constructor(values) {
    let index = -1;
    const length = values == null ? 0 : values.length;

    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }

  add(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }

  has(value) {
    return this.__data__.has(value);
  }
}

SetCache.prototype.push = SetCache.prototype.add;

function getMapData({ __data__ }, key) {
  const data = __data__;
  return isKeyable(key)
    ? data[typeof key === 'string' ? 'string' : 'hash']
    : data.map;
}

function isKeyable(value) {
  const type = typeof value;
  return type === 'string' ||
    type === 'number' ||
    type === 'symbol' ||
    type === 'boolean'
    ? value !== '__proto__'
    : value === null;
}

class MapCache {
  constructor(entries) {
    let index = -1;
    const length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      const entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  clear() {
    this.size = 0;
    this.__data__ = {
      hash: new Hash(),
      map: new Map(),
      string: new Hash()
    };
  }

  delete(key) {
    const result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  get(key) {
    return getMapData(this, key).get(key);
  }

  has(key) {
    return getMapData(this, key).has(key);
  }

  set(key, value) {
    const data = getMapData(this, key);
    const size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
}

class Hash {
  constructor(entries) {
    let index = -1;
    const length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      const entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  clear() {
    this.__data__ = Object.create(null);
    this.size = 0;
  }

  delete(key) {
    const result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  get(key) {
    const data = this.__data__;
    const result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  has(key) {
    const data = this.__data__;
    return data[key] !== undefined;
  }

  set(key, value) {
    const data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = value === undefined ? HASH_UNDEFINED : value;
    return this;
  }
}

function arrayIncludes(array, value) {
  const length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
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

function arrayIncludesWith(array, target, comparator) {
  if (array == null) {
    return false;
  }

  for (const value of array) {
    if (comparator(target, value)) {
      return true;
    }
  }
  return false;
}

function map(array, iteratee) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = new Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

function cacheHas(cache, key) {
  return cache.has(key);
}

function differenceBy(array, ...values) {
  debugger;
  let iteratee = last(values);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(
        array,
        baseFlatten(values, 1, isArrayLikeObject, true),
        iteratee
      )
    : [];
}

function last(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

function differenceWith(array, ...values) {
  debugger;
  let comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(
        array,
        baseFlatten(values, 1, isArrayLikeObject, true),
        undefined,
        comparator
      )
    : [];
}

// console.log(difference([1, 2, 3, 4], [2, 4, 1, 4]))
// console.log(differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x'))
var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 }
];
function compare(a, b) {
  return a - b;
}
var result = differenceWith(objects, [{ x: 1, y: 2 }], compare);
console.log(result);
