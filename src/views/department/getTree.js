/**
 * 简化树形数据
 * @param {data} 要简化的树形数据
 * @Author: W_peach
 */
export function getTree(data) {
  for (const i in data) {
    // 删除name、children以外属性
    if (i !== 'name' && i !== 'children') {
      delete data[i]
    }
    // children只有一个值时
    if (i === 'children' && data[i].length === 1) {
      data[i] = [getTree(data[i][0])]
    }
    // children为多值时
    if (i === 'children' && data[i].length > 1) {
      data[i].forEach((item, index) => {
        item = getTree(item)
      })
    }
  }
  return data
}
