function flatten(array) {
  debugger
  const length = array == null ? 0 : array.length
  return length ? baseFlatten(array, 1) : []
}

function baseFlatten(array, depth, predicate, isStrict, result) {
  predicate || (predicate = isFlattenable)
  result || (result = [])

  if (array == null) {
    return result
  }

  for (const value of array) {
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        baseFlatten(value, depth - 1, predicate, isStrict, result)
      } else {
        result.push(...value)
      }
    } else if (!isStrict) {
      result[result.length] = value
    }
  }
  return result
}

const spreadableSymbol = Symbol.isConcatSpreadable

function isFlattenable(value) {
  return Array.isArray(value) || isArguments(value) ||
    !!(value && value[spreadableSymbol])
}


function isArguments(value) {
  return isObjectLike(value) && getTag(value) == '[object Arguments]'
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null
}

const toString = Object.prototype.toString

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

function flattenDeep(array) {
  debugger
  const length = array == null ? 0 : array.length
  return length ? baseFlatten(array, INFINITY) : []
}

function flattenDepth(array, depth) {
  debugger
  const length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  depth = depth === undefined ? 1 : +depth
  return baseFlatten(array, depth)
}