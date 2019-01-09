<template>
  <div class="main">
    <el-row :span="24">
      <el-col :sm="22" :md="18" :lg="13">
        <el-input v-model="inputValue" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" class="search" @keyup.enter.native="search" />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="createUser">+ 添加</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="userChecked"
      :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      @row-click="checkBox"
      @select-change="selected">
      <el-table-column type="index" align="center" />
      <el-table-column type="selection" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="name" label="真实姓名" align="center" />
      <el-table-column label="用户状态" align="center" >
        <template slot-scope="scope">
          <i :class="['icon', scope.row.status? 'iconTrue' : 'iconFalse']" />
        </template>
      </el-table-column>
      <el-table-column prop="group" label="所属机构" align="center" />
      <el-table-column prop="role" label="所属角色" align="center" />
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="editUser">编辑</el-button>
          <el-button size="medium" type="text" @click="edit">修改密码</el-button>
          <el-button size="medium" type="text" style="color: #f56c6c;" @click="del(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 确认删除组件 -->
    <del-user :show.sync="delUserVisible" @confirmDel="delUser" />
    <!-- 修改密码组件 -->
    <edit-password :show.sync="editPasswordVisible" @confirmEdit="editPass" @cancelEdit="cancelEditPass"/>
    <!-- 新建/编辑用户组件 -->
    <user-info :show.sync="userinfoVisible" :flag="isCreate" :formData="userinfoData" @confirmAdd="addUser" @closeDialog="cancel" />

    <el-pagination
      :page-size="pageSize"
      :current-page="currentPage"
      :total="tableData.length"
      layout="total, prev, pager, next, jumper"
      class="pagination-style"
      @size-page="getPageSize"
      @current-change="getCurrentPage"
    />
  </div>
</template>

<script>
import DelUser from '@/components/confirmDel/index'
import EditPassword from './components/EditPassword'
import UserInfo from './components/UserInfo'
import { Message } from 'element-ui'
export default {
  components: {
    DelUser,
    EditPassword,
    UserInfo
  },
  data() {
    return {
      tableData: [
        { username: 'wawaa', name: '哇哒哒', status: true, group: '总公司', role: 'admin' },
        { username: 'sada', name: '萨达', status: false, group: '分公司', role: 'test' },
        { username: 'lisa', name: '丽萨', status: true, group: '总公司', role: 'editor' },
        { username: 'wawaa', name: '哇哒哒', status: true, group: '总公司', role: 'admin' },
        { username: 'sqw', name: '社区网', status: false, group: '分公司', role: 'test' },
        { username: 'admin', name: '管理员', status: true, group: '总公司', role: 'admin' }
      ],
      pageSize: 5, // 单页容纳元素量
      currentPage: 1, // 当前页码
      inputValue: '', // 搜索框值
      filterValue: '', // 模糊搜索值
      delUserVisible: false, // 确认删除组件开关
      editPasswordVisible: false, // 修改密码组件开发
      isCreate: false, // 是否新增用户标识
      userinfoVisible: false, // 编辑、新增用户组件开关
      delIndex: 0, // 存储删除索引
      editUserForm: { // 编辑用户数据
        username: 'admin',
        name: '管理员',
        password: '',
        repeatPass: '',
        department: '总公司',
        email: 'www.2223131@164.com',
        telephone: '0731-292912',
        mobphone: '13512342255',
        startDate: '',
        remark: ''
      },
      defaultForm: { // 新增用户数据
        username: '',
        name: '',
        password: '',
        repeatPass: '',
        department: '',
        email: '',
        telephone: '',
        mobphone: '',
        startDate: '',
        remark: ''
      },
      userinfoData: {} // 存放userinfo组件数据
    }
  },
  computed: {
    userList() {
      const filterValue = this.filterValue
      if (filterValue !== '') {
        const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
        if (!reg.test(filterValue)) {
          Message({
            type: 'error',
            message: '请输入中、英文、数字类型的关键词!'
          })
        } else {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return String(dataNews[key]).toLowerCase().indexOf(filterValue) > -1
            })
          })
        }
      }
      return this.tableData
    }
  },
  methods: {
    search() { // 搜索框的值赋给过滤器
      this.filterValue = this.inputValue
    },
    checkBox(row) { // 点击当前行选中/取消复选框
      this.$refs.userChecked.toggleRowSelection(row)
    },
    getPageSize(val) { // pageSize改变时触发，获取页面元素个数
      this.pageSize = val
    },
    getCurrentPage(val) { // 当前页码改变时触发，获取当前野马
      this.currentPage = val
    },
    del(index) { // 打开删除弹出框
      this.delUserVisible = true
      this.delIndex = index
    },
    delUser() { // 确定删除
      this.delUserVisible = false
      Message({
        type: 'info',
        message: '删除成功'
      })
      this.userList.splice(this.delIndex, 1)
    },
    edit() { // 打开修改密码弹出框
      this.editPasswordVisible = true
    },
    editPass() { // 修改密码成功
      this.editPasswordVisible = false
    },
    cancelEditPass() { // 取消修改密码
      this.editPasswordVisible = false
    },
    selected(row) { // 选中复选框触发回调
      console.log(row)
    },
    addUser(newFormData) { // 确认新建用户
      this.userinfoVisible = false
      Message({
        type: 'success',
        message: this.isCreate ? '新建用户成功' : '编辑用户成功'
      })
      console.info(newFormData)
    },
    createUser() { // 打开新增用户组件
      this.userinfoVisible = true
      this.isCreate = true
      this.userinfoData = Object.assign({}, this.defaultForm)
    },
    editUser() { // 打开编辑用户组件
      this.userinfoVisible = true
      this.isCreate = false
      this.userinfoData = Object.assign({}, this.editUserForm)
    },
    cancel() { // 取消新增/编辑用户
      this.userinfoVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 30px;
  .el-col{
    float: right;
    text-align: right;
    .search{
      width: 50%;
    }
  }
}
.icon{
  display: inline-block;
  height: 30px;
  width: 30px;
}
.iconTrue{
  background: url('~@/assets/userManage_images/true.png') center center no-repeat;
  background-size: cover;
}
.iconFalse{
  background: url('~@/assets/userManage_images/false.png') center center no-repeat;
  background-size: cover;
}
.pagination-style{
  margin-top: 3%;
  text-align: center;
}
</style>
