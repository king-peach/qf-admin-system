import request from '@/utils/request'

export function getConfigMsg() {
  return request({
    url: '/api/config/data',
    method: 'post'
  })
}

export function saveConfigMsg(configName, configKey, configValue, remark) {
  return request({
    url: '/api/config/save',
    method: 'post',
    data: {
      configName,
      configKey,
      configValue,
      remark
    }
  })
}
