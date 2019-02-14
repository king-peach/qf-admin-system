import request from '@/utils/request'

export function getLogInfo(pageNum, pageSize, data = {}) {
  return request({
    url: '/operLog/getOperLogs',
    params: {
      pageNum,
      pageSize,
      title: data.title,
      operBy: data.operby
    }
  })
}

export function delLog(data) {
  return request({
    url: '/operLog/deleteOperLogByIds',
    method: 'post',
    data: data
  })
}

export function clearLog() {
  return request({
    url: '/operLog/clean',
    method: 'post'
  })
}
