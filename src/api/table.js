import request from '@/utils/request'

export function getList() {
  return request({
    url: '/sys/info',
    method: 'post'
  })
}
