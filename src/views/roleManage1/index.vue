<template>
  <div class="main">
    <el-row :gutter="24" class="btn-content">
      <el-col :span="16">
        <el-select v-model="value" placeholder="请选择机构">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" plain @click="openAddRole">新增角色</el-button>
        <!-- <el-button type="primary" plain @click="openUserList">新增用户</el-button> -->
        <el-button type="danger" plain @click="handleAllDelete">批量删除</el-button>
      </el-col>
    </el-row>
    <el-collapse accordion>
      <template v-for="(value, key, index) in datas">
        <el-collapse-item :title="key" :name="index" :key="key">
          <div class="right">
            <el-button type="primary" plain>编辑权限</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="value"
            highlight-current-row
            style="width:100%"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange">
            <el-table-column type="index" />
            <el-table-column type="selection" />
            <el-table-column label="用户名" prop="username" align="center" />
            <el-table-column label="真实姓名" prop="name" align="center" />
            <el-table-column label="操作" min-width="30">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 新增角色提示框 -->
          <add-role :show.sync="addRoleVisible" :role="roles" @confirmAdd="addRole" />
          <!-- 新增用户提示框 -->
          <add-user :show.sync="addUserVisible" :user="userList" @confirmAdd="addUser" />
          <!-- 删除提示框 -->
          <del-user :show.sync="delVisible" @confirmDel="delUser" @cancel="cancelDel"/>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import AddRole from './components/AddRole'
import AddUser from './components/AddUser'
import DelUser from './components/DelUser'
export default {
  components: {
    AddRole,
    AddUser,
    DelUser
  },
  data() {
    return {
      datas: {
        管理员: [{ username: 'admin1', name: '管理员一' }, { username: 'admin2', name: '管理员二' }, { username: 'admin3', name: '管理员三' }],
        编辑组: [{ username: 'editor', name: '编辑一' }, { username: 'editor', name: '编辑二' }, { username: 'editor', name: '编辑三' }]
      },
      userList: [
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' },
        { username: 'admin', name: '管理员', status: '禁用', email: 'www.google.com' }
      ],
      options: [
        { value: '选项1', label: '总公司' },
        { value: '选项2', label: '分公司' }
      ],
      value: '',
      multipleDel: [], // 存储批量删除项数据
      delVisible: false, // 删除弹框开关
      msg: '', // 存储单行删除项数据
      delArr: [], // 存储待删除项
      // addUserVisible: false, // 新增用户弹框开关
      labelPosition: 'right', // 新增表单的位置
      roles: { id: '', name: '', group: '', remark: '' }, // 新增表单项名称
      addRoleVisible: false // 新增角色弹框开关
    }
  },
  methods: {
    handleCurrentChange(val) { // 当前行触发函数
      console.log('触发当前行')
    },
    handleDelete(index, row) { // 单行删除处理函数
      // this.tableData.splice(index, 1)
      // Message({
      //   message: '删除成功',
      //   type: 'success'
      // })
      this.idx = index
      this.msg = row
      this.delArr.push(this.msg.name)
      this.delVisible = true
      console.log(this.msg)
    },
    handleSelectionChange(val) { // 多选操作
      this.multipleDel = val
    },
    handleAllDelete() { // 批量删除处理函数
      this.delVisible = true
      for (const i of this.multipleDel) {
        this.delArr.push(i.name)
      }
      console.log(this.delArr)
    },
    delUser() { // 删除提示框确定删除处理函数
      this.delVisible = false
      Message({
        message: '删除成功',
        type: 'success'
      })
      this.delArr = []
    },
    cancelDel() {
      this.delVisible = false
      this.delArr = []
    },
    openUserList() { // 打开添加用户列表
      this.addUserVisible = true
    },
    addUser() { // 添加用户成功
      this.addUserVisible = false
      Message({
        message: '添加成功',
        type: 'success'
      })
    },
    openAddRole() { // 点击新增角色按钮函数
      this.addRoleVisible = true
    },
    addRole() { // 新增角色弹框关闭函数
      this.addRoleVisible = false
      console.log(this.roles)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-content{
  padding-bottom: 20px;
}
.right{
  text-align: right;
  padding: 0 50px;
}
</style>
