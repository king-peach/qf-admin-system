import request from '@/utils/request'

export function getDeptData(data = {}) {
  return request({
    url: '/dept/getDeptTree',
    method: 'get',
    params: {}
  })
}

export function createDept(data = {}) {
  return request({
    url: '/dept/addDept',
    method: 'post',
    data: {
      parentId: data.parentId,
      orderNum: data.orderNum,
      deptName: data.deptName,
      leader: data.leader,
      status: data.status,
      phone: data.phone,
      email: data.email
    }
  })
}
