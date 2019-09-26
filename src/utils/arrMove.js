/**
 * @method 数组元素交换位置
 * @param {array} array 原始数组
 * @param {number} index1 交换数组元素的位置1
 * @param {number} index2 交换数组元素的位置2
 */

function swapArray(array, index1, index2) {
  array[index1] = array.splice(index2, 1, array[index1])[0]
  return array
}

/**
 * @method 数组元素下移 (将当前数组index索引与后面一个元素互换位置，向数组后面移动一位)
 * @param {array} arr 原始数组
 * @param {number} index 待交换数组元素位置
 */

export function zIndexDown(arr, index) {
  const length = arr.length

  if (index + 1 < length && index > -1) {
    swapArray(arr, index, index + 1)
  } else if (index + 1 === length) {
    return false
  } else {
    console.log(`zIndexDown函数的参数index不存于数组arr中`)
  }
}

/**
 * @method 数组元素上移 (将当前数组index索引与前面一个元素互换位置，向数组前面移动一位)
 * @param {array} arr 原始数组
 * @param {number} index 待交换数组元素位置
 */

export function zIndexUp(arr, index) {
  const length = arr.length

  if (index < length && index > 0) {
    swapArray(arr, index, index - 1)
  } else if (index === 0) {
    return false
  } else {
    console.log(`zIndexUp函数的参数index不在数组arr中`)
  }
}

/**
 * @method 数组元素置底 (将当前元素移到数组的最后一位)
 * @param {arrar} arr 原始数组
 * @param {number} index 待置顶元素的位置
 */

export function zIndexBottom(arr, index) {
  const length = arr.length

  if (index + 1 < length && index > -1) {
    [arr[index], arr[length - 1]] = [arr[length - 1], arr[index]]
  } else if (index + 1 === length) {
    return false
  } else {
    console.log(`zIndexBottom函数的参数index不在数组arr中`)
  }
}

/**
 * @method 数组元素置顶 (将当前元素移动到数组的第一位)
 * @param {arr} arr 原始数组
 * @param {number} index 待质底元素的位置
 */

export function zIndexTop(arr, index) {
  const length = arr.length

  if (index < length && index > 0) {
    [arr[index], arr[0]] = [arr[0], arr[index]]
  } else if (index === 0) {
    return false
  } else {
    console.log(`zIndexTop函数的参数index不在数组arr中`)
  }
}
