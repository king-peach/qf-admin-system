<template>
  <div class="main">
    <el-row :span="24">
      <el-col :sm="22" :md="18" :lg="13">
        <el-input v-model="inputValue" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" class="search" @keyup.enter.native="search" />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary">+ 添加</el-button>
        <el-button type="primary">修改密码</el-button>
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
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="small">编辑</el-button>
          <el-button size="mini" type="danger" @click="del(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除弹出框 -->
    <del-user :show.sync="delUserVisible" @confirmDel="delUser" />

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
import DelUser from './components/DelUser'
import { Message } from 'element-ui'
export default {
  components: {
    DelUser
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
      delUserVisible: false, // 删除提示框开关
      delIndex: 0 // 存储删除索引
    }
  },
  computed: {
    userList() {
      const filterValue = this.filterValue
      if (filterValue !== '') {
        const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/ // 匹配中英文和数字
        if (!reg.test(filterValue)) {
          Message({
            type: 'error',
            message: '请输入正确检索条件!'
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
  watch: {

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
    del(index) { // 打开删除提示框
      this.delUserVisible = true
      this.delIndex = index
      console.info(this.delIndex)
    },
    delUser() { // 确定删除
      this.delUserVisible = false
      Message({
        type: 'success',
        message: '删除成功'
      })
      this.userList.splice(this.delIndex, 1)
    },
    selected(row) { // 选中复选框触发回调
      console.log(row)
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
  background: url('~@/assets/userManage_images/stop.png') center center no-repeat;
  background-size: cover;
}
.pagination-style{
  margin-top: 3%;
  text-align: center;
}
</style>
