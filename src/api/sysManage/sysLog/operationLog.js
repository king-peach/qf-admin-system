import request from '@/utils/request'

export function getLogInfo(pageNum, pageSize, data = {}) {
  return request({
    url: '/operLog/getOperLogs',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      title: data.title,
      operBy: data.operBy,
      operLocation: data.operLocation,
      operType: data.operType
    }
  })
}

export function delLog(data) {
  return request({
    url: '/operLog/deleteOperLogByIds',
    method: 'post',
    data: {
      operIds: data
    }
  })
}

export function clearLog() {
  return request({
    url: '/operLog/clean',
    method: 'post'
  })
}
