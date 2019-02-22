<template>
  <div class="main">
    <!-- 搜索组件 -->
    <search-box :formData="searchForm" @search="search"></search-box>

    <div class="container">
      <el-button type="danger" size="medium" icon="el-icon-delete">删除</el-button>
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="openAdd">新增</el-button>
      <el-table
        :data="tableData"
        stripe
        v-loading="loading"
        :row-style="getRowIndex"
        highlight-current-row
        style="margin-top: 10px;"
        @row-click="currentSelected"
        :default-sort="{prop: 'roleId', order: 'ascending'}">
        <el-table-column prop="num" label="序号" align="center" width="80" sortable />
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="角色代码" prop="roleKey" sortable align="center" width="100" />
        <el-table-column label="上级主管" prop="leader" align="center" />
        <el-table-column label="用户状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="handleStatus(scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" >
            <el-button size="mini" @click="editRole">编辑</el-button>
            <!-- <el-button size="mini" small>权限设置</el-button> -->
            <el-button type="danger" size="mini" @click.native.prevent="openDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 确认删除角色组件 -->
      <del-role :show.sync="delRoleVisible" :type="delType" @confirmDelOne="delRole" />
      <!-- 新增/编辑角色组件 -->
      <add-role :show.sync="roleInfoVisible" :role="roles" :treeData="deptTree" :isCreate="isCreate" @confirmAdd="addRole" @confirmEdit="editSuccess" @cancel="cancelAdd" />
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
  </div>
</template>

<script>
import DelRole from '@/components/ConfirmDel/index'
import AddRole from './components/AddRole'
import SearchBox from '@/components/SearchBox'
import { getRoleInfo, addRole, editStatus, delRole, editRole } from '@/api/sysManage/roleManage'
import { getDeptData } from '@/api/sysManage/department'
import { parseTime } from '@/utils/index'
import { Message } from 'element-ui'
export default {
  components: {
    DelRole,
    AddRole,
    SearchBox
  },
  data() {
    return {
      loading: true, // 加载状态
      searchForm: {
        roleName: { label: '角色名称', value: '' },
        roleKey: { label: '角色代码', value: '' },
        status: { label: '状态', value: null }
      },
      tableData: [], // 存储所有角色数据
      roles: {}, // 新增/编辑角色表单数据
      deptTree: [], // 组织机构树数据
      createRoles: { roleKey: '', roleName: '', status: true, createBy: '', roleSort: null, menuIds: [], ramark: '' }, // 新增角色信息
      roleList: [],
      pageSize: 8, // 页面包含选项个数
      currentPage: 1, // 当前页码
      total: 10, // 数据总数
      delRoleVisible: false, // 删除角色开关
      roleInfoVisible: false, // 新增角色开关
      delIndex: 0, // 存储删除索引
      isCreate: true, // 是否新建角色
      searchData: {}, // 存储搜索条件
      delType: 'delOne' // 存储确认删除组件状态
    }
  },
  created() { // 获取所有角色
    this.getData()
    getDeptData().then(response => {
      this.deptTree = response.data
    }).catch(error => { return error })
  },
  methods: {
    search(data) { // 点击搜索
      this.getData(data)
      Object.getOwnPropertyNames(data).forEach((key) => { // 存储搜索值
        this.searchData[key] = data[key]
      })
    },
    getData(data) { // 获取表格数据
      getRoleInfo(this.currentPage, this.pageSize, data).then(response => {
        if (response.success === true) {
          this.loading = false
        }
        this.tableData = response.data.list
        this.tableData.forEach((element, index) => {
          element.status === 1 ? element.status = true : element.status = false
          element.createTime = parseTime(element.createTime)
          element.num = (this.currentPage - 1) * this.pageSize + index + 1
        })
        this.total = response.data.total
      })
    },
    handleCurrentChange(val) { // currentPage改变时触发的回调
      this.currentPage = val
      this.getData(this.searchData)
    },
    handleStatus(index) { // 状态改变时触发回调
      const roleId = this.tableData[index].roleId
      let status = this.tableData[index].status
      status === true ? status = 1 : status = 0
      editStatus(roleId, status).then(response => {
        if (response.success === true) {
          Message({
            type: 'success',
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
      delRole(this.tableData[this.delIndex].roleId).then(response => {
        if (response.success === true) {
          this.tableData.splice(this.delIndex, 1)
          this.delRoleVisible = false
          Message({
            type: 'success',
            message: '删除成功'
          })
        }
      }).catch(error => { return error }) // axios全局错误已处理，此处只捕获不处理
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
      data.status = data.status === true ? 1 : 0
      addRole(data).then(response => {
        if (response.success === true) {
          this.roleInfoVisible = false
          Message({
            type: 'success',
            message: '新增用户成功'
          })
          this.getData()
        }
      }).catch(error => { return error })
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
          this.roleInfoVisible = false
          Message({
            type: 'success',
            message: '角色信息提交成功'
          })
          this.getData()
        }
      }).catch(error => { return error })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 1px 3px #ddd;
  .pagination-style{
    margin-top: 20px;
  }
}
</style>
