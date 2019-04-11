import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css' // 现在浏览器样式重置表

import {
  Pagination,
  Scrollbar,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tag,
  Tree,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Card,
  Cascader,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局css

import '@/icons' // icon
import '@/permission' // 权限控制

Vue.config.productionTip = false

// element-ui 组件按需加载
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Scrollbar)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(Main)
Vue.use(Footer)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

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
