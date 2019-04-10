import { asyncRouterMap, constantRouterMap } from '@/router'
import { listToTree } from '@/utils/getTree'
import Layout from '@/views/layout/Layout'

/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
// function convertRouter(routes) {
//   const accessedRouters = []
//   if (routes) {
//     routes.forEach(item => {
//       var parent = generateRouter(item, true, true)
//       var children = []
//       if (item.children) {
//         item.children.forEach(child => {
//           if (child.children) {
//             const thirdRoute = []
//             thirdRoute.push(child)
//             const formattingThirdRoute = convertRouter(thirdRoute)[0]
//             children.push(formattingThirdRoute)
//           }
//           children.push(generateRouter(child, false))
//         })
//       }
//       parent.children = children
//       accessedRouters.push(parent)
//     })
//   }
//   accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
//   return accessedRouters
// }

/**
 * 动态路由列表信息完善
 * @param {*} routes 待转化路由列表
 */
function formattingRouter(routes) {
  const accessedRouters = []
  if (routes) {
    let isRoot, isParent
    const routeIds = []
    routes.forEach(item => {
      routeIds.push(item.routeId)
    })
    routes.forEach(item => {
      isRoot = item.parentId === 0
      isParent = routeIds.includes(item.parentId)
      accessedRouters.push(generateRouter(item, isRoot, isParent))
    })
  }
  return accessedRouters
}

/**
 * 根据name新增meta、components、path等信息
 * @param {*} item 待转化对象
 * @param {*} isRoot 是否为根元素
 * @param {*} isParent 是否为父元素
 */
function generateRouter(item, isRoot, isParent) {
  var router = {
    parentId: item.parentId,
    routeId: item.routeId,
    path: isParent ? '/' + item.name : item.name,
    name: item.name,
    alwaysShow: item.name === 'sysWatch',
    meta: metaMap[item.name],
    component: isRoot ? Layout : componentsMap[item.name]
  }
  return router
}
// components映射表
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
// meta 映射表
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
        // const { roles } = data
        // const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // const routes = listToTree(asyncRouterMap, { parentId: 'parentId', id: 'routeId' }, 0)
        const routesList = formattingRouter(asyncRouterMap)
        const accessedRouters = listToTree(routesList, { parentId: 'parentId', id: 'routeId' }, 0)
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        // console.info(accessedRouters)
        // if (roles.includes('admin')) {
        //   accessedRouters = asyncRouterMap
        // } else {
        // }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
