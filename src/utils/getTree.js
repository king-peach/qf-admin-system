/*
 * 将扁平的数组生成树形结构
 * @param {data} 原始数据
 * @param {param} 父子关系对象: parentId(parentId属性名)、id(id属性名)
 * @parentId 根元素parentId
 */
export function listToTree(data, param, parentId) {
  const tree = []
  let temp
  data.forEach(element => {
    // parentId 所属父元素id
    if (element[param.parentId] === parentId) {
      const obj = element
      temp = listToTree(data, param, element[param.id])
      // 存在子元素、创建children
      if (temp.length > 0) {
        obj.children = temp
      }
      tree.push(obj)
    }
  })
  return tree
}

/**
 * 根据搜索条件查找树节点
 * @param {*} nodes 原始数据
 * @param {*} predicate 搜索条件
 */

export function filterNode(nodes, predicate) {
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return []
  }

  const newChildren = []
  for (const node of nodes) {
    if (predicate(node)) {
      // 如果节点符合条件，直接加入新的节点集
      newChildren.push({ ...node })
      node.children = filterNode(node.children, predicate)
    } else {
      // 如果当前节点不符合条件，递归过滤子节点,
      // 把符合条件的子节点提升上来，并入新节点集
      newChildren.push(...filterNode(node.children, predicate))
    }
  }
  return newChildren
}
