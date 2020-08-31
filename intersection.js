function fromEntries(pairs) {
  const result = {};
  if (pairs == null) {
    return result;
  }
  for (const pair of pairs) {
    result[pair[0]] = pair[1];
  }
  return result;
}

function initial(array) {
  const length = array == null ? 0 : array.length;
  return length ? slice(array, 0, -1) : [];
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

function map(array, iteratee) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  const result = new Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

function baseIntersection(arrays, iteratee, comparator) {
  const includes = comparator ? arrayIncludesWith : arrayIncludes;
  const length = arrays[0].length;
  const othLength = arrays.length;
  const caches = new Array(othLength);
  const result = [];

  let array;
  let maxLength = Infinity;
  let othIndex = othLength;

  while (othIndex--) {
    array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = map(array, (value) => iteratee(value));
    }
    maxLength = Math.min(array.length, maxLength);
    caches[othIndex] =
      !comparator && (iteratee || (length >= 120 && array.length >= 120))
        ? new SetCache(othIndex && array)
        : undefined;
  }
  array = arrays[0];

  let index = -1;
  const seen = caches[0];

  outer: while (++index < length && result.length < maxLength) {
    let value = array[index];
    const computed = iteratee ? iteratee(value) : value;

    value = comparator || value !== 0 ? value : 0;
    if (
      !(seen
        ? cacheHas(seen, computed)
        : includes(result, computed, comparator))
    ) {
      othIndex = othLength;
      while (--othIndex) {
        const cache = caches[othIndex];
        if (
          !(cache
            ? cacheHas(cache, computed)
            : includes(arrays[othIndex], computed, comparator))
        ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
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

// const HASH_UNDEFINED = '__lodash_hash_undefined__'

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

function cacheHas(cache, key) {
  return cache.has(key);
}

function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
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

function isObjectLike(value) {
  return typeof value === 'object' && value !== null;
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null;
}

function intersectionBy(...arrays) {
  debugger;
  let iteratee = last(arrays);
  const mapped = map(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }
  return mapped.length && mapped[0] === arrays[0]
    ? baseIntersection(mapped, iteratee)
    : [];
}

function intersectionWith(...arrays) {
  debugger;
  let comparator = last(arrays);
  const mapped = map(arrays, castArrayLikeObject);

  comparator = typeof comparator === 'function' ? comparator : undefined;
  if (comparator) {
    mapped.pop();
  }
  return mapped.length && mapped[0] === arrays[0]
    ? baseIntersection(mapped, undefined, comparator)
    : [];
}

function last(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

function intersection(...arrays) {
  debugger;
  const mapped = map(arrays, castArrayLikeObject);
  return mapped.length && mapped[0] === arrays[0]
    ? baseIntersection(mapped)
    : [];
}

const arrs = [
  [1, 2],
  [2, 3],
  [2, 4]
];
console.log(intersection(...arrs));
console.log(intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor));
const objects = [
  {
    x: 1,
    y: 2
  },
  {
    x: 2,
    y: 1
  }
];

const others = [
  {
    x: 1,
    y: 1
  },
  {
    x: 1,
    y: 2
  }
];

function comparator(arrVal, othVal) {
  return arrVal.x === othVal.x;
}
console.log(intersectionWith(objects, others, comparator));
