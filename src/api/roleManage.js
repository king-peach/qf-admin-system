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
