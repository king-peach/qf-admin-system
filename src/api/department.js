import request from '@/utils/request'

export function getDeptData(data = {}) {
  return request({
    url: '/dept/getDeptTree',
    method: 'get',
    params: {}
  })
}
