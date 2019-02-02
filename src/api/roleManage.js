import request from '@/utils/request'

export function getRoleInfo(pageNum, pageSize) {
  return request({
    url: '/role/getAllRoles',
    methods: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function addRole(data) {
  return request({
    url: '/role/addRole',
    methods: 'post',
    data: {
      roleKey: data.roleKey,
      roleName: data.rolename,
      status: data.status
    }
  })
}
