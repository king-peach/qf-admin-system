import request from '@/utils/request'

export function getRoleInfo(pageNum, pageSize) {
  return request({
    url: '/role/getAllRoles',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data: {
      roleKey: data.roleKey,
      roleName: data.roleName,
      status: data.status,
      menuIds: [],
      roleSort: data.roleSort
    }
  })
}

export function editStatus(roleId, status) {
  return request({
    url: '/role/changeStatus',
    method: 'post',
    data: {
      roleId,
      status
    }
  })
}

export function delRole(roleId) {
  return request({
    url: '/role/deleteRole/' + roleId,
    method: 'delete'
  })
}

export function editRole(data) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: {
      roleName: data.roleName,
      roleKey: data.roleKey,
      roleId: data.roleId,
      status: data.status,
      roleSort: data.roleSort
    }
  })
}