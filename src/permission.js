import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

NProgress.configure({ showSpinner: false })// 进度条配置

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 如果当前页面是Dashboard则不触发beforeEach hook,所以立即执行它
    } else {
      if (store.getters.asyncRouter) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          store.dispatch('GenerateRoutes', res.data.asyncRouter).then(() => { // 拉取动态路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法，确保addRoutes已经完成，replace设置未true，导航不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败, 请重新登录！')
            next({ path: '/' })
          })
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
