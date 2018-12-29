import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/sys/info',
    method: 'post'
  })
}
