<template>
  <el-dialog :visible.sync="editRoleVisible" :show="show" title="角色列表" @close="cancelEdit">
    <el-table :data="user.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row>
      <el-table-column type="index" />
      <el-table-column label="用户名" prop="username" align="center" />
      <el-table-column label="真实姓名" prop="name" align="center" />
      <el-table-column label="用户状态" prop="status" align="center" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delUser(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editRoleVisible = false">取 消</el-button>
      <el-button @click="addUser">添加用户</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    <!-- 分页器 -->
    <el-pagination
      :page-size="pageSize"
      :total="user.length"
      small
      layout="total, prev, pager, next, jumper"
      @current-change="getCurrentPage"
      @size-change="getPageSize" />
    <!-- 用户列表 -->
    <add-user :disabled="addUserVisible" @addSuccess="confirmAdd" @cancelAdd="cancel" />
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'
import AddUser from './AddUser'
export default {
  components: {
    AddUser
  },
  props: {
    user: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editRoleVisible: this.show, // 保存show值
      addUserVisible: false, // 用户列表开关
      pageSize: 5, // 单页包含元素数量
      currentPage: 1 // 当前页码
    }
  },
  watch: {
    show() { // show值改变时，editRoleVisible也对应改变
      this.editRoleVisible = this.show
    }
  },
  methods: {
    confirm() { // 编辑完点击确认
      this.$emit('confirmEdit', this.multipleAdd)
      this.multipleAdd = [] // 点击确定按钮后，清空选中的用户数据
    },
    cancelEdit() { // 取消编辑
      this.$emit('cancel')
    },
    delUser(index) { // 删除用户
      this.user.splice(index, 1)
      Message({
        type: 'success',
        message: '删除成功'
      })
    },
    addUser() { // 添加用户开关
      this.addUserVisible = true
    },
    confirmAdd() { // 确认添加用户操作
      this.addUserVisible = false
      Message({
        type: 'success',
        message: '添加用户成功'
      })
    },
    cancel() { // 取消添加用户
      this.addUserVisible = false
    },
    getPageSize(size) { // pageSize改变时触发的回调
      this.pageSize = size
    },
    getCurrentPage(val) { // currentPage改变时触发的回调
      this.currentPage = val
    }
  }
}
</script>
