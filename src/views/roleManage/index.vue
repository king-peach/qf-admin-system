<template>
  <div class="main">
    <el-row>
      <el-select v-model="value" placeholder="请选择机构" style="margin-right: 10px;">
        <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="searchValue" placeholder="请输入角色名称" class="search-input" suffix-icon="el-icon-search" @keyup.enter.native="searchRole"/>
      <el-button type="primary" @click="searchRole">搜索</el-button>
      <el-button type="primary" @click="openAdd">+ 添加</el-button>
    </el-row>

    <el-table
      :data="tableData"
      border
      :row-style="getRowIndex"
      highlight-current-row
      style="100%"
      @row-click="currentSelected">
      <el-table-column label="ID" prop="roleId" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center" />
      <el-table-column label="上级主管" prop="createBy" align="center" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="handleStatus(scope.$index)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" >
          <el-button size="mini" @click="editRole">编辑</el-button>
          <el-button size="mini" small>权限设置</el-button>
          <el-button type="danger" size="mini" @click.native.prevent="openDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 确认删除角色组件 -->
    <del-role :show.sync="delRoleVisible" @confirmDel="delRole" />
    <!-- 新增/编辑角色组件 -->
    <add-role :show.sync="roleInfoVisible" :role="roles" :isCreate="isCreate" @confirmAdd="addRole" @confirmEdit="editSuccess" @cancel="cancelAdd" />
    <!-- 分页器 -->
    <el-pagination
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      small
      layout="total, prev, pager, next, jumper"
      class="pagination-style"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import DelRole from '@/components/ConfirmDel/index'
import AddRole from './components/AddRole'
import { getRoleInfo, addRole, editStatus, delRole, editRole } from '@/api/roleManage'
import { Message } from 'element-ui'
export default {
  components: {
    DelRole,
    AddRole
  },
  data() {
    return {
      options: [
        { value: 'header', label: '总公司' },
        { value: 'branch', label: '分公司' }
      ],
      value: '', // 选择框值
      searchValue: '', // 搜索框值
      roleFilter: '', // 存储模糊搜索值
      tableData: [], // 存储所有角色数据
      roles: {}, // 新增/编辑角色表单数据
      createRoles: { roleKey: '', roleName: '', status: true, createBy: '', roleSort: null, menuIds: [], ramark: '' }, // 新增角色信息
      roleList: [],
      pageSize: 10, // 页面包含选项个数
      currentPage: 1, // 当前页码
      total: 10, // 总页数
      delRoleVisible: false, // 删除角色开关
      roleInfoVisible: false, // 新增角色开关
      delIndex: 0, // 存储删除索引
      isCreate: true // 是否新建角色
    }
  },
  computed: {
    tables() { // 模糊搜索功能
      const roleFilter = this.roleFilter
      if (roleFilter !== '') {
        const reg = /^[\u4e00-\u9fa5]+$/
        if (!reg.test(roleFilter)) {
          Message({
            type: 'error',
            message: '请输入中文关键词'
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
  created() { // 获取所有角色
    this.getData()
  },
  methods: {
    searchRole() { // enter触发模糊搜索
      this.roleFilter = this.searchValue
    },
    getData() { // 获取表格数据
      getRoleInfo(this.currentPage, this.pageSize).then(response => {
        this.tableData = response.data.list
        this.tableData.forEach(element => {
          element.status === 1 ? element.status = true : element.status = false
        })
        this.total = response.data.total
      })
    },
    handleCurrentChange(val) { // currentPage改变时触发的回调
      this.currentPage = val
      this.getData()
    },
    handleStatus(index) { // 状态改变时触发回调
      const roleId = this.tableData[index].roleId
      let status = this.tableData[index].status
      status === true ? status = 1 : status = 0
      editStatus(roleId, status).then(response => {
        if (response.success === true) {
          Message({
            type: 'info',
            message: '状态修改成功'
          })
        }
      })
    },
    openDel(index) { // 打开删除弹出框
      this.delRoleVisible = true
      this.delIndex = index
    },
    delRole() { // 确认删除操作
      this.delRoleVisible = false
      delRole(this.tableData[this.delIndex].roleId).then(response => {
        if (response.success === true) {
          this.tableData.splice(this.delIndex, 1)
          Message({
            type: 'info',
            message: '删除成功'
          })
        }
      })
    },
    getRowIndex({ row, rowIndex }) { // 获取当前行索引
      row.index = rowIndex
    },
    currentSelected(row, event) { // 点击当前行触发
      const index = row.index
      this.roles = {}
      this.roles = { ...this.tableData[index] }
      // console.info(this.editRoles)
    },
    openAdd() { // 打开新增用户弹出框
      this.roleInfoVisible = true
      this.isCreate = true
      this.roles = {}
      this.roles = { ...this.createRoles }
    },
    addRole(data) { // 确认新增用户
      this.roleInfoVisible = false
      data.status = data.status === true ? 1 : 0
      addRole(data).then(response => {
        if (response.success === true) {
          Message({
            type: 'info',
            message: '新增用户成功'
          })
          this.getData()
        }
      })
    },
    cancelAdd() { // 取消新增用户操作
      this.roleInfoVisible = false
    },
    editRole() { // 打开编辑角色弹出框
      this.roleInfoVisible = true
      this.isCreate = false
      this.roles = {}
    },
    editSuccess(editRoles) { // 编辑角色成功
      editRoles.status = editRoles.status === true ? 1 : 0
      editRole(editRoles).then(response => {
        if (response.success === true) {
          Message({
            type: 'info',
            message: '角色信息提交成功'
          })
          this.getData()
        }
      })
      this.roleInfoVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  padding-bottom: 20px;
  .col-right {
    text-align: right;
  }
}
.search-input{
  width:30%;
}
.pagination-style{
  margin-top: 20px;
}
</style>
