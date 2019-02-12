<template>
  <div class="main">
    <div class="left">
      <div class="switch">
        <div @click="departSwitch = !departSwitch">
          <span :class="departSwitch === true ? 'to-right' : 'to-left'" />
        </div>
      </div>
      <div :class="['box', departSwitch === true ? 'show' : 'hide']">
        <header>
          <h4>组织机构</h4>
        </header>
        <div class="box-container">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </div>
    </div>
    <div :class="['right', departSwitch === true ? 'move-right' : 'move-left']">
      <el-row>
        <el-input v-model="inputValue" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" class="search" @keyup.enter.native="search" />
        <el-button type="primary" @click="search">搜索</el-button>
      </el-row>

      <div class="container">
        <el-button type="danger" size="medium" icon="el-icon-delete">删除</el-button>
        <el-button type="primary" size="medium" @click="createUser" icon="el-icon-plus">添加</el-button>
        <el-table
          ref="userChecked"
          :data="tableData"
          stripe
          :row-style="getRowIndex"
          @row-click="handleClickRow"
          @select="selected"
          @select-all="selectAll"
          style="margin-top: 10px;">
          <el-table-column type="index" label="ID" align="center" width="50" />
          <el-table-column type="selection" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="realName" label="真实姓名" align="center" />
          <el-table-column prop="status" label="用户状态" align="center" >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" @change="handleStatus(scope.$index)" />
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="所属机构" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" width="180" />
          <el-table-column label="操作" width="200" align="center">
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
        <edit-password :show.sync="editPasswordVisible" :user="userPsw" @confirmEdit="editPass" @cancelEdit="cancelEditPass"/>
        <!-- 新建/编辑用户组件 -->
        <user-info :show.sync="userinfoVisible" :flag="isCreate" :formData="userinfoData" @confirmAdd="addUser" @confirmEdit="editSuccess" @closeDialog="cancel" />
        <!-- 分页器 -->
        <el-pagination
          :page-size="pageSize"
          :current-page="currentPage"
          :total="userList.length"
          layout="total, prev, pager, next, jumper"
          class="pagination-style"
          @current-change="getCurrentPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DelUser from '@/components/ConfirmDel/index'
import EditPassword from './components/EditPassword'
import UserInfo from './components/UserInfo'
import { getUserInfo, editUser, createUser, editPassword } from '@/api/userManage'
import { Message } from 'element-ui'
export default {
  components: {
    DelUser,
    EditPassword,
    UserInfo
  },
  data() {
    return {
      tableData: [],
      pageSize: 5, // 单页容纳元素量
      currentPage: 1, // 当前页码
      inputValue: '', // 搜索框值
      filterValue: '', // 模糊搜索值
      delUserVisible: false, // 确认删除组件开关
      editPasswordVisible: false, // 修改密码组件开关
      userPsw: { name: '', userId: '', oldPassword: '', userPassword: '', newPassword: '' }, // 修改用户密码所需数据
      isCreate: false, // 是否新增用户标识
      userinfoVisible: false, // 编辑、新增用户组件开关
      rowIndex: 0, // 存储点击当前行索引
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
      data: [{ // tree data
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
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
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getUserInfo(this.currentPage, this.pageSize).then(response => {
        this.tableData = response.data.list
        this.tableData.forEach(element => {
          element.status = element.status === 1 ? true : false
        })
      })
    },
    search() { // 搜索框的值赋给过滤器
      this.filterValue = this.inputValue
    },
    handleClickRow(row) { // 点击当前行回调
      this.userinfoData = { ...row }
      const index = row.index
      this.userPsw.name = this.tableData[index].username
      this.userPsw.userId = this.tableData[index].userId
      this.userPsw.userPassword = this.tableData[index].password
      // this.$refs.userChecked.toggleRowSelection(row)
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
    },
    del(index) { // 打开删除弹出框
      this.delUserVisible = true
      this.rowIndex = index
    },
    delUser() { // 确定删除
      this.delUserVisible = false
      Message({
        type: 'info',
        message: '删除成功'
      })
      this.userList.splice(this.rowIndex, 1)
    },
    edit() { // 打开修改密码弹出框
      this.editPasswordVisible = true
    },
    editPass(newData) { // 修改密码成功
      this.editPasswordVisible = false
      const data = { ...newData }
      editPassword(data).then(response => {
        console.info(response)
      })
    },
    cancelEditPass() { // 取消修改密码
      this.editPasswordVisible = false
    },
    addUser(newFormData) { // 确认新建用户
      this.userinfoVisible = false
      const data = { ...newFormData }
      data.status = data.status === true ? 1 : 0
      createUser(data).then(response => {
        if (response.success === true) {
          Message({
            type: 'success',
            message: '新建用户成功'
          })
        }
      })
    },
    editSuccess(newFormData) { // 确认编辑用户
      this.userinfoVisible = false
      const data = { ...newFormData }
      data.status = data.status === true ? 1 : 0
      editUser(data).then(response => {
        if (response.success === true) {
          Message({
            type: 'success',
            message: '用户信息提交成功'
          })
        }
      })
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
    handleStatus() { // 改变状态时回调

    },
    handleNodeClick(data) {
      return
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 20px;
  .search{
    width: 30%;
  }
}
.left {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  height: 100%;
  .box {
    width: 190px;
    &.show {
      width: 190px;
      font-size: 16px;
      transition: .5s width, .5s font-size;
      .box-container {
        visibility: visible;
        transition: 1s visibility;
      }
    }
    &.hide {
      width: 0;
      font-size: 0;
      transition: .5s width;
      .box-container {
        visibility: hidden;
      }
    }
    header {
      border-bottom: 1px solid #ebeef5;
      h4 {
        text-align: center;
        color: #909399;
        font-weight: 500;
      }
    }
    .box-container {
      padding: 20px;
    }
  }
  .switch {
    float: right;
    width: 10px;
    height: 100%;
    background: #ebeef5;
    position: relative;
    div {
      position: absolute;
      top: 50%;
      display: inline-block;
      width: 100%;
      height: 50px;
      transform: translateY(-50%);
      background-color: #dcdfe6;
      &:hover {
        background-color: #ffbb3df5;
      }
      span {
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .to-left {
        left: 2px;
        border-left-color: #666;
      }
      .to-right {
        left: -2px;
        border-right-color: #666;
      }
    }
  }
}
.right {
  width: 100%;
  padding-left: 190px;
  &.move-left {
    padding-left: 0;
    transition: .5s padding-left;
  }
  &.move-right {
    padding-left: 190px;
    transition: .5s padding-left;
  }
  .container {
    min-height: 600px;
    background-color: #FFF;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, .2);
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
