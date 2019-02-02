import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
// import qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // if (config.method === 'get') {
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
/** status ！== 1时，账号密码错误，抛出错误 */
service.interceptors.response.use(
  response => {
    /** 处理返回值 **/
    const res = response.data
    if (res.success !== true) {
      /** 内置提醒框 **/
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 5 * 1000
      })
      // if (res.status === 0) {
      //   // 弹出层警告，登出或者留在该界面
      //   MessageBox.confirm(
      //     '你已被登出，可以取消继续留在该页面，或者重新登录',
      //     '确定登出',
      //     {
      //       confirmButtonText: '重新登陆',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   ).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload() // 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
