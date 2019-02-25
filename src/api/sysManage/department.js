import request from '@/utils/request'

export function getDeptData(data = {}) {
  return request({
    url: '/dept/getDeptList',
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

export function ChangeStatus(data) {
  return request({
    url: '/dept/changeStatus',
    method: 'post',
    data: {
      deptId: data.deptId,
      status: data.status
    }
  })
}

export function editDept(data) {
  return request({
    url: '/dept/updateDept',
    method: 'post',
    data: {
      deptId: data.deptId,
      deptName: data.deptName,
      orderNum: data.orderNum,
      eamil: data.email,
      leader: data.leader,
      parentId: data.parentId,
      phone: data.phone,
      status: data.status
    }
  })
}

export function delDept(id) {
  return request({
    url: '/dept/deleteDept/' + id,
    method: 'delete'
  })
}
