import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// 开发模式下未使用懒加载，页面太多会导致热加载过慢，所以只在生产模式下使用懒加载
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   如果为true, 则不在sidebar中显示，默认是false
* alwaysShow: true               如果设置为true, 则始终显示根目录, 无论子路由的个数是多少
*                                如果不设置alwaysShow, 子路由不能超过一个,如果超过一个, 将变成嵌套模式, 不显示根目录
* redirect: noredirect           如果设置 `redirect:noredirect` 面包屑中该位置将不能点击
* name:'router-name'             <keep-alive>使用的属性 (必须设置!!!)
* meta : {
    title: 'title'               在子菜单（submenu）和面包屑(breadcrumb)中显示的名称 (推荐设置)
    icon: 'svg-name'             sidebar中显示icon,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  { /** 系统信息 **/
    path: '/sysInfo',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'sysInfo',
        component: () => import('@/views/sysInfo/index'),
        meta: { title: '系统信息', icon: 'sysInfo' }
      }
    ]
  },

  { /** 配置项管理 **/
    path: '/configItem',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'configItem',
        component: () => import('@/views/configItem/index'),
        meta: { title: '配置项管理', icon: 'configItem' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { /** 角色管理 **/
    path: '/roleManage',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/roleManage/index'),
        name: 'roleManage',
        meta: { title: '角色管理', icon: 'roleManage', roles: ['admin'] }
      }
    ]
  },

  { /** 用户管理 **/
    path: '/userManage',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/userManage/index'),
        name: 'userManage',
        meta: { title: '用户管理', icon: 'roleManage', roles: ['admin'] }
      }
    ]
  },

  { /* 定时任务 */
    path: '/setTime',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/setTime/index'),
        name: 'setTime',
        meta: { title: '定时任务', icon: 'setTime', roles: ['admin'] }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
