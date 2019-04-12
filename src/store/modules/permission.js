import { constantRouterMap } from '@/router'
import { listToTree } from '@/utils/getTree'
import Layout from '@/views/layout/Layout'

/**
 * 动态路由列表信息完善
 * @param {*} routes 待转化路由列表
 */
function formattingRouter(routes) {
  const accessedRouters = []
  if (routes) {
    let isRoot, isParent
    const parentIds = []
    routes.forEach(item => {
      parentIds.push(item.parentId)
    })
    routes.forEach(item => {
      isRoot = item.parentId === 0
      isParent = parentIds.includes(item.routeId)
      accessedRouters.push(generateRouter(item, isRoot, isParent))
    })
  }
  return accessedRouters
}

/**
 * 根据name新增meta、components、path等信息
 * @param {*} item 待转化对象
 * @param {*} isRoot 是否为根路由
 * @param {*} isParent 是否为父路由
 */
function generateRouter(item, isRoot, isParent) {
  var router = {
    parentId: item.parentId,
    routeId: item.routeId,
    path: isRoot ? '/' + item.name : item.name,
    name: item.name,
    alwaysShow: isRoot,
    meta: metaMap[item.name],
    component: isRoot ? Layout : componentsMap[item.name]
  }
  if (isRoot || isParent) {
    router = {
      parentId: item.parentId,
      routeId: item.routeId,
      path: isRoot ? '/' + item.name : item.name,
      alwaysShow: isRoot,
      meta: metaMap[item.name],
      component: isRoot ? Layout : componentsMap[item.name]
    }
  }
  return router
}
/**
 * conponents映射表
 * 需对接后端、如新增菜单需添加路由信息（结构参照以下）
 */
export const componentsMap = {
  sysInfo: () => import('@/views/sysManage/sysInfo/index'),
  configItem: () => import('@/views/sysManage/configItem/index'),
  menuManage: () => import('@/views/sysManage/menuManage/index'),
  roleManage: () => import('@/views/sysManage/roleManage/index'),
  userManage: () => import('@/views/sysManage/userManage/index'),
  department: () => import('@/views/sysManage/department/index'),
  sysLog: () => import('@/views/sysManage/sysLog/index'),
  loginLog: () => import('@/views/sysManage/sysLog/loginLog/index'),
  operationLog: () => import('@/views/sysManage/sysLog/operationLog/index'),
  setTime: () => import('@/views/sysWatch/setTime/index')
}
/**
 * meta 字段映射表
 * 需对接后端、如新增菜单需添加映射信息（结构参照以下）
 */
export const metaMap = {
  sysInfo: { title: '系统信息', icon: 'sysInfo' },
  sysManage: { title: '系统管理', icon: 'sysManage' },
  configItem: { title: '配置项管理', icon: 'configItem' },
  menuManage: { title: '菜单管理', icon: 'menuManage' },
  roleManage: { title: '角色管理', icon: 'roleManage' },
  userManage: { title: '用户管理', icon: 'user' },
  department: { title: '组织机构', icon: 'tree' },
  sysLog: { title: '系统日志', icon: 'sysLog' },
  loginLog: { title: '登录日志', icon: 'logLog' },
  operationLog: { title: '操作日志', icon: 'operLog' },
  sysWatch: { title: '系统监控', icon: 'sysWatch' },
  setTime: { title: '定时任务', icon: 'setTime', btnPermission: ['search', 'remove'] }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const routesList = formattingRouter(data)
        const asyncRouterMap = listToTree(routesList, { parentId: 'parentId', id: 'routeId' }, 0)
        asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
