<template>
  <!-- 两列自适应布局 -->
  <two-column-layout :leftColumnTitle="leftColumnTitle">
    <template v-slot:left-content>
      <el-tree
        :data="deptTree"
        :expand-on-click-node="false"
        highlight-current
        :props="defaultProps"
        default-expand-all
        @node-click="handleNodeClick"
      />
    </template>
    <template v-slot:right-content id="main">
      <SearchBox :formData="searchForm" @search="search" />

      <div id="container">
        <el-button type="danger" size="medium" icon="el-icon-delete">删除</el-button>
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="createUser">添加</el-button>
        <el-table
          ref="userChecked"
          v-loading="loading"
          :data="tableData"
          stripe
          :row-style="getRowIndex"
          style="margin-top: 10px;"
          @row-click="handleClickRow"
          @select="selected"
          @select-all="selectAll"
        >
          <el-table-column prop="num" label="序号" sortable align="center" width="80" />
          <el-table-column type="selection" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="realName" label="真实姓名" align="center" />
          <el-table-column prop="status" label="用户状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" @change="handleStatus(scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="所属机构" align="center" />
          <el-table-column prop="createTime" label="创建时间" sortable align="center" width="160" />
          <el-table-column prop="email" label="邮箱" align="center" width="160" show-overflow-tooltip />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="medium" type="text" @click="editUser">编辑</el-button>
              <el-button size="medium" type="text" @click="edit">修改密码</el-button>
              <el-button size="medium" type="text" style="color: #f56c6c;" @click="del(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 确认删除组件 -->
        <DelUser :show.sync="delUserVisible" :type="delType" @confirmDelOne="delUser" />
        <!-- 修改密码组件 -->
        <EditPassword :show.sync="editPasswordVisible" :user="userPsw" @confirmEdit="editPass" @cancelEdit="cancelEditPass" />
        <!-- 新建/编辑用户组件 -->
        <UserInfo :show.sync="userinfoVisible" :flag="isCreate" :formData="userinfoData" :treeData="deptTree" :options="roleList" @confirmAdd="addUser" @confirmEdit="editSuccess" @closeDialog="cancel" />
        <!-- 分页器 -->
        <el-pagination
          :page-size="pageSize"
          :current-page="currentPage"
          :total="total"
          layout="total, prev, pager, next, jumper"
          class="pagination-style"
          @current-change="getCurrentPage"
        />
      </div>
    </template>
  </two-column-layout>
</template>

<script>
import DelUser from '@/components/ConfirmDel/index'
import EditPassword from './components/EditPassword'
import UserInfo from './components/UserInfo'
import SearchBox from '@/components/SearchBox'
import TwoColumnLayout from '@/components/TwoColumnLayout'
import { getUserInfo, editUser, createUser, editPassword, changeStatus } from '@/api/sysManage/userManage'
import { getRoleInfo } from '@/api/sysManage/roleManage'
import { getDeptData } from '@/api/sysManage/department'
import { listToTree } from '@/utils/getTree'
import { Message, Notification } from 'element-ui'
import { parseTime } from '@/utils/index'
export default {
  name: 'userManage',
  components: {
    DelUser,
    EditPassword,
    UserInfo,
    SearchBox,
    TwoColumnLayout
  },
  data() {
    return {
      leftColumnTitle: '组织机构',
      tableData: [],
      loading: true, // 加载状态
      pageSize: 5, // 单页容纳元素量
      currentPage: 1, // 当前页码
      total: 10, // 数据总数
      delUserVisible: false, // 确认删除组件开关
      delType: 'delOne', // 存储确认删除框状态
      editPasswordVisible: false, // 修改密码组件开关
      userPsw: { name: '', userId: '', oldPassword: '', newPassword: '' }, // 修改用户密码所需数据
      isCreate: false, // 是否新增用户标识
      userinfoVisible: false, // 编辑、新增用户组件开关
      rowIndex: 0, // 存储点击当前行索引
      searchData: {}, // 存储搜索值
      defaultForm: { // 新增用户数据
        username: '',
        realName: '',
        password: '',
        repeatPass: '',
        deptId: '',
        status: true,
        email: '',
        phone: '',
        remark: ''
      },
      userinfoData: {}, // 存放userinfo组件数据
      departSwitch: true, // 组织机构树盒子开关
      deptTree: [], // 存放组织机构树数据
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      searchForm: { // 搜索组件数据
        username: { label: '用户名', value: '' },
        realName: { label: '真实姓名', value: '' },
        status: { label: '状态', value: null },
        date: { label: '创建时间', value: '' }
      },
      roleList: [] // 存放角色列表
    }
  },
  created() {
    this.getData({ deptId: 1 })
    getDeptData().then(response => {
      this.deptTree = listToTree(response.data, { id: 'deptId', parentId: 'parentId' }, 0)
    }).catch(error => { return error })
    // 获取所有角色，调用角色管理页接口最多获取1000个数据，待优化
    getRoleInfo(1, 1000).then(response => {
      this.roleList = response.data.list
    }).catch(error => { return error })
  },
  methods: {
    getData(data) {
      getUserInfo(this.currentPage, this.pageSize, data).then(response => {
        if (response.success === true) {
          this.loading = false
        }
        this.tableData = response.data.list
        this.total = response.data.total
        this.tableData.forEach((element, index) => {
          element.status === 1 ? element.status = true : element.status = false
          element.createTime = parseTime(element.createTime)
          element.num = (this.currentPage - 1) * this.pageSize + index + 1
          element.roleIds = [1, 2]
        })
      })
    },
    handleClickRow(row) { // 点击当前行回调
      this.userinfoData = { ...row }
      const index = row.index
      this.userPsw.name = this.tableData[index].username
      this.userPsw.userId = this.tableData[index].userId
    },
    getRowIndex({ row, rowIndex }) { // 获取当前行索引
      row.index = rowIndex
    },
    selected(row) { // 选中复选框触发回调
      console.log(row)
    },
    selectAll(selection) { // 全选回调
      console.info(selection)
    },
    getCurrentPage(val) { // 当前页码改变时触发，获取当前页码
      this.currentPage = val
      this.getData(this.searchData)
    },
    del(index) { // 打开删除弹出框
      this.delUserVisible = true
      this.rowIndex = index
    },
    delUser() { // 确定删除
      this.delUserVisible = false
      Notification({
        type: 'success',
        message: '当前用户删除成功'
      })
      this.tableData.splice(this.rowIndex, 1)
    },
    edit() { // 打开修改密码弹出框
      this.editPasswordVisible = true
    },
    editPass(newData) { // 修改密码成功
      const data = { ...newData }
      editPassword(data).then(response => {
        if (response.success === true) {
          this.editPasswordVisible = false
          Message({
            type: 'success',
            message: '密码修改成功'
          })
        }
      }).catch(error => { return error }) // axios全局错误状态已处理，此处不做处理
    },
    cancelEditPass() { // 取消修改密码
      this.editPasswordVisible = false
    },
    addUser(newFormData) { // 确认新建用户
      const data = { ...newFormData }
      data.status = data.status === true ? 1 : 0
      createUser(data).then(response => {
        if (response.success === true) {
          this.userinfoVisible = false
          Message({
            type: 'success',
            message: '新建用户成功'
          })
        }
      }).catch(error => { return error })
    },
    editSuccess(newFormData) { // 确认编辑用户
      const data = { ...newFormData }
      data.status = data.status === true ? 1 : 0
      editUser(data).then(response => {
        if (response.success === true) {
          this.userinfoVisible = false
          Message({
            type: 'success',
            message: '用户信息提交成功'
          })
        }
      }).catch(error => { return error })
    },
    createUser() { // 打开新增用户组件
      this.userinfoVisible = true
      this.isCreate = true
      this.userinfoData = { ...this.defaultForm }
    },
    editUser() { // 打开编辑用户组件
      this.userinfoVisible = true
      this.isCreate = false
    },
    cancel() { // 取消新增/编辑用户
      this.userinfoVisible = false
    },
    handleStatus(index) { // 改变状态时回调
      const status = this.tableData[index] ? 1 : 0
      changeStatus(this.tableData[index].userId, status).then(response => {
        if (response.success) {
          Notification({
            message: '用户状态修改成功',
            type: 'success'
          })
        }
      }).catch(error => error)
    },
    handleNodeClick(data) {
      this.searchData.deptId = data.deptId
      this.getData(data)
    },
    search(searchForm) { // 点击搜索
      const startDate = parseTime(searchForm.date[0])
      const endDate = parseTime(searchForm.date[1])
      searchForm.startDate = startDate
      searchForm.endDate = endDate
      this.getData(searchForm)
      Object.getOwnPropertyNames(searchForm).forEach((key) => {
        this.searchData[key] = searchForm[key]
      })
    }
  }
}
</script>
