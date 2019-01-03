<template>
  <div class="main">
    <el-row :gutter="24" class="btn-content">
      <el-col :xl="12" :lg="14" :md="12" :xs="6">
        <el-select v-model="value" placeholder="请选择机构">
          <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :xl="12" :lg="10" :md="12" :xs="18">
        <span class="search-text">搜索: </span>
        <el-input v-model="inputValue" placeholder="请输入角色名称" class="search-input" suffix-icon="el-icon-search" @keyup.enter.native="searchRole"/>
        <el-button type="primary" @click="searchRole">搜索</el-button>
        <el-button type="primary" @click="openAdd">+ 添加</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :row-style="getRowIndex"
      highlight-current-row
      style="100%"
      @row-click="currentSelected">
      <el-table-column type="index" />
      <el-table-column label="角色名称" prop="name" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" >
          <el-button size="mini" @click="editRole">编辑</el-button>
          <el-button size="mini" small>权限设置</el-button>
          <el-button type="danger" size="mini" @click.native.prevent="openDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除角色 -->
    <del-role :show.sync="delRoleVisible" @confirmDel="delRole" @cancel="cancelDel" />
    <!-- 新增角色 -->
    <add-role :show.sync="addRoleVisible" :role="roles" @confirmAdd="addRole" @cancel="cancelAdd" />
    <!-- 编辑用户 -->
    <edit-role :show.sync="editRoleVisible" :user="userList" @confirmEdit="editSuccess" @cancel="cancelEdit" />
    <!-- 分页器 -->
    <el-pagination
      :page-size="pageSize"
      :total="tableData.length"
      small
      layout="total, prev, pager, next, jumper"
      class="pagination-style"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import DelRole from './components/DelRole'
import AddRole from './components/AddRole'
import EditRole from './components/EditRole'
import { Message } from 'element-ui'
export default {
  components: {
    DelRole,
    AddRole,
    EditRole
  },
  data() {
    return {
      options: [
        { value: 'header', label: '总公司' },
        { value: 'branch', label: '分公司' }
      ],
      value: '', // 选择框值
      inputValue: '', // 搜索框值
      roleFilter: '', // 存储模糊搜索值
      tableData: [
        {
          name: '管理员',
          data: [
            { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
            { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
            { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
            { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }
          ]
        },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '编辑', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] },
        { name: '测试', data: [{ username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }] }
      ],
      roles: { id: '', name: '', group: '', ramark: '' },
      roleList: [],
      pageSize: 10, // 页面包含选项个数
      currentPage: 1, // 当前页码
      delRoleVisible: false, // 删除角色开关
      addRoleVisible: false, // 新增角色开关
      editRoleVisible: false, // 编辑角色开关
      userList: [], // 用户列表
      delIndex: 0 // 存储删除索引
    }
  },
  computed: {
    tables() { // 模糊搜索功能
      const roleFilter = this.roleFilter
      console.log(roleFilter)
      if (roleFilter !== '') {
        const reg = /^[\u4e00-\u9fa5]+$/ // 匹配中文
        if (!reg.test(roleFilter)) {
          Message({
            type: 'error',
            message: '请输入正确检索条件!'
          })
        } else {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return String(dataNews[key]).toLowerCase().indexOf(roleFilter) > -1
            })
          })
        }
      }
      return this.tableData
    }
  },
  methods: {
    searchRole() { // enter触发模糊搜索
      this.roleFilter = this.inputValue
    },
    handleSizeChange(size) { // pageSize改变时触发的回调函数
      this.pageSize = size
    },
    handleCurrentChange(currentChange) { // currentPage改变时触发的回调
      this.currentPage = currentChange
    },
    openDel(index) { // 打开删除弹出框
      this.delRoleVisible = true
      this.delIndex = index
    },
    delRole() { // 确认删除操作
      this.delRoleVisible = false
      this.tables.splice(this.delIndex, 1)
      Message({
        type: 'success',
        message: '删除成功'
      })
    },
    cancelDel() { // 取消删除操作
      this.delRoleVisible = false
    },
    getRowIndex({ row, rowIndex }) { // 获取当前行索引
      row.index = rowIndex
    },
    currentSelected(row, event) { // 点击当前行触发
      const index = row.index
      this.userList = this.tableData[index].data
    },
    openAdd() { // 打开新增用户弹出框
      this.addRoleVisible = true
    },
    addRole() { // 确认新增用户
      this.addRoleVisible = false
      Message({
        type: 'success',
        message: '新增用户成功'
      })
    },
    cancelAdd() { // 取消新增用户操作
      this.addRoleVisible = false
    },
    editRole() { // 打开编辑角色弹出框
      this.editRoleVisible = true
    },
    editSuccess() { // 编辑角色成功
      this.editRoleVisible = false
    },
    cancelEdit() { // 取消编辑角色
      this.editRoleVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-content{
  padding-bottom: 20px;
}
.search-text{
  color:grey;
  margin-right: 10px;
}
.search-input{
  width: 45%;
}
.right{
  float: right;
}
.pagination-style{
  margin-top: 20px;
}
</style>
