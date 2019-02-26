import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css' // 现在浏览器样式重置表

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // 全局css

import '@/icons' // icon
import '@/permission' // 权限控制

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })

// 全局异常捕获// 全局异常捕获
const errorHandler = (error, vm) => {
  console.error('抛出全局错误')
  console.error(error)
  console.error(vm)
}
Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = (error) => errorHandler(error, this)

// 全局权限指令
Vue.directive('has', {
  inserted: function(el, binding, vnode) {
    // 获取当前页的按钮权限列表
    const btnPermissionArr = vnode.context.$route.meta.btnPermission
    if (btnPermissionArr.indexOf(binding.value) < 0) {
      el.parentNode.removeChild(el)
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
